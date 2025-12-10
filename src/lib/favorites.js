// Gestión de canciones favoritas en localStorage

// Obtener todas las canciones favoritas
export function getFavorites() {
    if (typeof window === 'undefined') return [];
    const favorites = localStorage.getItem('favorite_tracks');
    return favorites ? JSON.parse(favorites) : [];
}

// Añadir canción a favoritos
export function addFavorite(track) {
    const favorites = getFavorites();
    const exists = favorites.find(f => f.id === track.id);

    if (!exists) {
        favorites.push(track);
        localStorage.setItem('favorite_tracks', JSON.stringify(favorites));
    }
}

// Eliminar canción de favoritos
export function removeFavorite(trackId) {
    const favorites = getFavorites();
    const updated = favorites.filter(f => f.id !== trackId);
    localStorage.setItem('favorite_tracks', JSON.stringify(updated));
}

// Verificar si una canción es favorita
export function isFavorite(trackId) {
    const favorites = getFavorites();
    return favorites.some(f => f.id === trackId);
}

// Alternar estado de favorito
export function toggleFavorite(track) {
    if (isFavorite(track.id)) {
        removeFavorite(track.id);
        return false;
    } else {
        addFavorite(track);
        return true;
    }
}

// Limpiar todos los favoritos
export function clearFavorites() {
    localStorage.removeItem('favorite_tracks');
}
