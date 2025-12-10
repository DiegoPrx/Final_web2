'use client';

import { isFavorite } from '@/lib/favorites';

export default function TrackCard({ track, onRemove, onToggleFavorite }) {
    const favorite = isFavorite(track.id);

    // Formatear duración de ms a mm:ss
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-750 transition-colors group">
            {/* Portada */}
            <img
                src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                alt={track.name}
                className="w-12 h-12 rounded"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{track.name}</h4>
                <p className="text-gray-400 text-sm truncate">
                    {track.artists?.map(a => a.name).join(', ')}
                </p>
            </div>

            {/* Duración */}
            <span className="text-gray-400 text-sm hidden md:block">
                {formatDuration(track.duration_ms)}
            </span>

            {/* Botones */}
            <div className="flex gap-2">
                {/* Botón Favorito */}
                <button
                    onClick={() => onToggleFavorite(track)}
                    className={`p-2 rounded-full transition-all ${favorite
                            ? 'text-yellow-400 hover:text-yellow-300'
                            : 'text-gray-500 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
                        }`}
                    title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                    {favorite ? '⭐' : '☆'}
                </button>

                {/* Botón Eliminar */}
                <button
                    onClick={() => onRemove(track.id)}
                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                    title="Eliminar"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
