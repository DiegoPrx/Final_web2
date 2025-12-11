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
        <div className="group flex items-center gap-4 bg-gray-800/40 hover:bg-white/10 p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-white/5 backdrop-blur-sm">
            {/* Portada */}
            <div className="relative shadow-lg shadow-black/30 group-hover:scale-105 transition-transform duration-300">
                <img
                    src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                    alt={track.name}
                    className="w-14 h-14 rounded-md object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate text-base group-hover:text-green-400 transition-colors">
                    {track.name}
                </h4>
                <p className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors">
                    {track.artists?.map(a => a.name).join(', ')}
                </p>
            </div>

            {/* Duración */}
            <span className="text-gray-500 text-sm font-mono hidden sm:block">
                {formatDuration(track.duration_ms)}
            </span>

            {/* Botones */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                {/* Botón Favorito */}
                <button
                    onClick={() => onToggleFavorite(track)}
                    className={`p-2 rounded-full transition-all hover:bg-white/10 ${favorite
                        ? 'text-yellow-400 hover:text-yellow-300 scale-110'
                        : 'text-gray-400 hover:text-yellow-400'
                        }`}
                    title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                    {favorite ? '⭐' : '☆'}
                </button>

                {/* Botón Eliminar */}
                <button
                    onClick={() => onRemove(track.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all p-2 rounded-full"
                    title="Eliminar"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
