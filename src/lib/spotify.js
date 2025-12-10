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

// Generar playlist (Mock)
export async function generatePlaylist(preferences) {
  console.log('Generating playlist with preferences:', preferences);
  // Return empty or dummy playlist
  return [];
}