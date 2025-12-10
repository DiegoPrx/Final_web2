import { getAccessToken } from './auth';

// Mock Spotify API logic for Stage 1

// Buscar artistas (Mock)
export async function searchArtists(query) {
  console.log('Would search artists for:', query);
  return [];
}

// Buscar canciones (Mock)
export async function searchTracks(query) {
  console.log('Would search tracks for:', query);
  return [];
}

// Obtener top tracks de un artista (Mock)
export async function getArtistTopTracks(artistId) {
  return [];
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

// Obtener top tracks del usuario (Mock)
export async function getUserTopTracks() {
  return [];
}

// Generar playlist (Mock)
export async function generatePlaylist(preferences) {
  console.log('Generating playlist with preferences:', preferences);
  // Return empty or dummy playlist
  return [];
}