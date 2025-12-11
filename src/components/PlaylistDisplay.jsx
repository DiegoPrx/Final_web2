'use client';

import TrackCard from './TrackCard';

export default function PlaylistDisplay({
    playlist,
    onRemoveTrack,
    onToggleFavorite,
    onRefresh,
    onAddMore,
    onSave,
    isLoading
}) {

    if (isLoading) {
        return (
            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[500px]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Mezclando tu música...</h3>
                <p className="text-gray-400">Analizando ritmos, compatibilidad y vibes</p>
            </div>
        );
    }

    if (!playlist || playlist.length === 0) {
        return (
            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[500px] border-dashed border-2 border-gray-800">
                <div className="text-8xl mb-6 opacity-80 animate-bounce-slow">🎵</div>
                <h3 className="text-2xl font-bold text-white mb-3">Tu lienzo está vacío</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                    Selecciona tus artistas favoritos, un mood y una época para crear la playlist perfecta.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
                        Tu Mix Personalizado
                    </h2>
                    <p className="text-gray-400 flex items-center gap-2">
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-gray-300">{playlist.length} canciones</span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <button
                        onClick={onSave}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-green-900/40 hover:shadow-green-500/20 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <span>💾</span> Guardar en Spotify
                    </button>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={onAddMore}
                            className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all border border-white/5 flex items-center justify-center gap-2"
                        >
                            <span>➕</span> Añadir
                        </button>
                        <button
                            onClick={onRefresh}
                            className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all border border-white/5 flex items-center justify-center gap-2"
                        >
                            <span>🔄</span> Regenerar
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de canciones */}
            <div className="flex-1 overflow-y-auto pr-4 space-y-3 custom-scrollbar min-h-[400px]">
                {playlist.map((track, index) => (
                    <div key={track.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <TrackCard
                            track={track}
                            onRemove={onRemoveTrack}
                            onToggleFavorite={onToggleFavorite}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
