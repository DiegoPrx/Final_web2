import { getAccessToken } from './auth';

const BASE_URL = 'https://api.spotify.com/v1';

async function fetchSpotify(endpoint, method = 'GET', body = null) {
  const token = getAccessToken();
  if (!token) throw new Error('No access token');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    const errorBody = await res.json().catch(() => ({}));
    console.error('Spotify API Error Detail:', { status: res.status, endpoint, body: errorBody });
    throw new Error(errorBody?.error?.message || `Spotify API Error: ${res.status}`);
  }

  return res.json();
}

// ----------------------------------------------------------------------
// Mejora 3: Buscadores y Datos de Usuario
// ----------------------------------------------------------------------

export async function searchArtists(query) {
  if (!query) return [];
  const data = await fetchSpotify(`/search?q=${encodeURIComponent(query)}&type=artist&limit=10`);
  return data.artists.items;
}

export async function searchTracks(query) {
  if (!query) return [];
  const data = await fetchSpotify(`/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
  return data.tracks.items;
}

export async function getUserProfile() {
  return fetchSpotify('/me');
}

export async function getUserTopTracks() {
  const data = await fetchSpotify('/me/top/tracks?limit=20&time_range=medium_term');
  return data.items;
}

export async function getArtistTopTracks(artistId) {
  const data = await fetchSpotify(`/artists/${artistId}/top-tracks?market=ES`);
  return data.tracks;
}

// ----------------------------------------------------------------------
// Mejora 4: Algoritmo de Generación de Playlist
// ----------------------------------------------------------------------

async function getTracksAudioFeatures(trackIds) {

  if (!trackIds.length) return [];
  const chunks = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100));
  }

  let allFeatures = [];
  for (const chunk of chunks) {
    try {
      const data = await fetchSpotify(`/audio-features?ids=${chunk.join(',')}`);
      if (data.audio_features) {
        allFeatures = [...allFeatures, ...data.audio_features];
      }
    } catch (e) {
      console.warn(`Failed to fetch audio features for chunk of ${chunk.length} tracks`, e);

    }
  }
  return allFeatures.filter(f => f);
}

export async function generatePlaylist(preferences) {
  const {
    genres,
    artists,
    tracks: seedTracks,
    decades,
    popularity,
    mood
  } = preferences;

  let pool = [];


  if (artists && artists.length > 0) {
    const artistPromises = artists.map(a => getArtistTopTracks(a.id));
    const artistTracks = await Promise.all(artistPromises);
    artistTracks.forEach(tracks => pool.push(...tracks));
  }


  if (seedTracks && seedTracks.length > 0) {
    pool.push(...seedTracks);
  }


  const seedArtistIds = artists.map(a => a.id).slice(0, 2);
  const seedTrackIds = seedTracks.map(t => t.id).slice(0, 3);
  const seedGenre = genres.slice(0, 1);

  if (seedArtistIds.length > 0 || seedTrackIds.length > 0 || seedGenre.length > 0) {
    let query = `/recommendations?limit=50&market=ES`;
    if (seedArtistIds.length) query += `&seed_artists=${seedArtistIds.join(',')}`;
    if (seedTrackIds.length) query += `&seed_tracks=${seedTrackIds.join(',')}`;
    if (seedGenre.length && seedArtistIds.length + seedTrackIds.length < 5) query += `&seed_genres=${seedGenre.join(',')}`;


    if (mood) {
      Object.entries(mood).forEach(([key, value]) => {
        query += `&target_${key.split('_')[1]}=${value}`;
      });
    }

    try {
      const recData = await fetchSpotify(query);
      pool.push(...recData.tracks);
    } catch (e) {
      console.warn("Recommendations failed", e);
    }
  }


  const uniqueTracks = new Map();
  pool.forEach(t => uniqueTracks.set(t.id, t));
  pool = Array.from(uniqueTracks.values());




  if (decades && decades.length > 0) {
    pool = pool.filter(track => {
      const releaseDate = track.album.release_date;
      const year = parseInt(releaseDate.split('-')[0]);
      return decades.some(d => {
        const decadeStart = parseInt(d);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }


  if (popularity) {
    const [min, max] = popularity;
    pool = pool.filter(track => track.popularity >= min && track.popularity <= max);
  }


  if (mood && pool.length > 0) {
    try {
      const trackIds = pool.map(t => t.id);
      const features = await getTracksAudioFeatures(trackIds);

      if (features.length > 0) {
        const featuresMap = new Map(features.map(f => [f.id, f]));

        pool = pool.filter(track => {
          const f = featuresMap.get(track.id);
          if (!f) return false;

          return Object.entries(mood).every(([key, value]) => {
            const [op, featureName] = key.split('_');
            if (op === 'min') return f[featureName] >= value;
            if (op === 'max') return f[featureName] <= value;
            return true;
          });
        });
      }
    } catch (err) {
      console.error("Mood filtering failed (continuing without it):", err);

    }
  }


  pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, 30);
}

// ----------------------------------------------------------------------
// Mejora 5: Guardar Playlist
// ----------------------------------------------------------------------

export async function createPlaylist(userId, name, description = "Generated by Taste Mixer") {
  return fetchSpotify(`/users/${userId}/playlists`, 'POST', {
    name,
    description,
    public: false
  });
}

export async function addTracksToPlaylist(playlistId, trackUris) {
  return fetchSpotify(`/playlists/${playlistId}/tracks`, 'POST', {
    uris: trackUris
  });
}