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

// Obtener perfil del usuario (Mock)
export async function getUserProfile() {
  return {
    display_name: "Usuario de Prueba",
    id: "test_user",
    images: [] // images[0].url
  };
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