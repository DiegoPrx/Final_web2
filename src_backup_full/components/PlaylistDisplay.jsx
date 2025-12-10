'use client';

import TrackCard from './TrackCard';

export default function PlaylistDisplay({
    playlist,
    onRemoveTrack,
    onToggleFavorite,
    onRefresh,
    onAddMore,
    isLoading
}) {

    if (isLoading) {
        return (
            <div className="bg-gray-900 rounded-xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Generando playlist...</p>
            </div>
        );
    }

    if (!playlist || playlist.length === 0) {
        return (
            <div className="bg-gray-900 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl text-gray-300 mb-2">No hay playlist generada</h3>
                <p className="text-gray-500">Selecciona tus preferencias y genera una playlist</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Tu Playlist</h2>
                    <p className="text-gray-400">{playlist.length} canciones</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onAddMore}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
                    >
                        ➕ Añadir más
                    </button>
                    <button
                        onClick={onRefresh}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
                    >
                        🔄 Refrescar
                    </button>
                </div>
            </div>

            {/* Lista de canciones */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {playlist.map((track) => (
                    <TrackCard
                        key={track.id}
                        track={track}
                        onRemove={onRemoveTrack}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>
        </div>
    );
}
