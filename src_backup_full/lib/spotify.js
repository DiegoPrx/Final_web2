import { getAccessToken } from './auth';

// Buscar artistas
export async function searchArtists(query) {
  const token = getAccessToken();
  if (!token) throw new Error('No token disponible');

  const response = await fetch(
    `https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&limit=10`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) throw new Error('Error al buscar artistas');
  const data = await response.json();
  return data.artists.items;
}

// Buscar canciones
export async function searchTracks(query) {
  const token = getAccessToken();
  if (!token) throw new Error('No token disponible');

  const response = await fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=20`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) throw new Error('Error al buscar canciones');
  const data = await response.json();
  return data.tracks.items;
}

// Obtener top tracks de un artista
export async function getArtistTopTracks(artistId) {
  const token = getAccessToken();
  if (!token) throw new Error('No token disponible');

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) throw new Error('Error al obtener top tracks');
  const data = await response.json();
  return data.tracks;
}

// Obtener perfil del usuario
export async function getUserProfile() {
  const token = getAccessToken();
  if (!token) throw new Error('No token disponible');

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Error al obtener perfil');
  return await response.json();
}

// Obtener top tracks del usuario
export async function getUserTopTracks() {
  const token = getAccessToken();
  if (!token) throw new Error('No token disponible');

  const response = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?limit=20',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) throw new Error('Error al obtener top tracks');
  const data = await response.json();
  return data.items;
}

// Generar playlist basada en preferencias
export async function generatePlaylist(preferences) {
  const { artists = [], genres = [], decades = [], popularity = [0, 100], tracks: seedTracks = [], mood } = preferences;
  const token = getAccessToken();
  if (!token) throw new Error('No token disponible');

  let allTracks = [];

  try {
    // 1. Obtener tracks de artistas seleccionados
    if (artists.length > 0) {
      for (const artist of artists) {
        const tracks = await getArtistTopTracks(artist.id);
        allTracks.push(...tracks);
      }
    }

    // 2. Usar canciones semilla (Track Widget)
    if (seedTracks.length > 0) {
      // Añadir las propias canciones semilla
      allTracks.push(...seedTracks);

      // Buscar recomendaciones basadas en el artista principal de cada canción semilla
      for (const track of seedTracks) {
        if (track.artists && track.artists[0]) {
          const tracks = await getArtistTopTracks(track.artists[0].id);
          allTracks.push(...tracks);
        }
      }
    }

    // 3. Buscar por géneros
    if (genres.length > 0) {
      for (const genre of genres) {
        try {
          const tracks = await searchTracks(`genre:${genre}`);
          allTracks.push(...tracks.slice(0, 5)); // Limitar a 5 por género
        } catch (e) {
          console.error(`Error buscando género ${genre}:`, e);
        }
      }
    }

    // 4. Si no hay suficientes tracks, obtener del usuario
    if (allTracks.length < 10) {
      const userTracks = await getUserTopTracks();
      allTracks.push(...userTracks);
    }

    // 5. Filtrar por década
    if (decades.length > 0) {
      allTracks = allTracks.filter(track => {
        if (!track.album?.release_date) return false;
        const year = new Date(track.album.release_date).getFullYear();
        return decades.some(decade => {
          const decadeStart = parseInt(decade);
          return year >= decadeStart && year < decadeStart + 10;
        });
      });
    }

    // 6. Filtrar por popularidad
    const [minPop, maxPop] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= minPop && track.popularity <= maxPop
    );

    // 7. Filtrar por Mood (Simulado)
    // Si tuviéramos acceso a audio-features sería ideal, pero requiere muchas llamadas API.
    // Por ahora, si hay un mood seleccionado, podemos priorizar ciertos géneros o aleatorizar de forma diferente.
    // (Implementación futura: llamar a /audio-features para los tracks finales)

    // 8. Eliminar duplicados por ID
    const uniqueTracks = Array.from(
      new Map(allTracks.map(track => [track.id, track])).values()
    );

    // 9. Mezclar y limitar a 30 canciones
    return uniqueTracks.sort(() => Math.random() - 0.5).slice(0, 30);

  } catch (error) {
    console.error('Error generando playlist:', error);
    throw error;
  }
}