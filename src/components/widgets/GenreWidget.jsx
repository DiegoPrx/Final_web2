'use client';

const genres = [
    { id: 'pop', name: 'Pop', emoji: '🎤', color: 'from-pink-500 to-rose-500' },
    { id: 'rock', name: 'Rock', emoji: '🎸', color: 'from-red-500 to-orange-500' },
    { id: 'hip-hop', name: 'Hip Hop', emoji: '🧢', color: 'from-purple-500 to-indigo-500' },
    { id: 'electronic', name: 'Electronic', emoji: '⚡', color: 'from-blue-400 to-cyan-500' },
    { id: 'latin', name: 'Latino', emoji: '💃', color: 'from-yellow-400 to-orange-500' },
    { id: 'indie', name: 'Indie', emoji: '🌿', color: 'from-green-400 to-emerald-500' },
    { id: 'metal', name: 'Metal', emoji: '🤘', color: 'from-gray-700 to-black' },
    { id: 'r-n-b', name: 'R&B', emoji: '🎷', color: 'from-blue-600 to-purple-700' },
];

export default function GenreWidget({ selectedGenres = [], onSelect }) {
    const toggleGenre = (genreId) => {
        if (selectedGenres.includes(genreId)) {
            onSelect(selectedGenres.filter(g => g !== genreId));
        } else {
            if (selectedGenres.length < 3) {
                onSelect([...selectedGenres, genreId]);
            }
        }
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🎧</span> Géneros
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Elige hasta 3 estilos</p>
                </div>
                <div className="bg-gray-800/50 px-3 py-1 rounded-full text-xs font-mono text-gray-300 border border-white/5">
                    {selectedGenres.length}/3
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {genres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre.id);
                    return (
                        <button
                            key={genre.id}
                            onClick={() => toggleGenre(genre.id)}
                            disabled={!isSelected && selectedGenres.length >= 3}
                            className={`
                                relative overflow-hidden rounded-xl p-3 transition-all duration-300 text-left group w-full
                                ${isSelected
                                    ? `bg-gradient-to-br ${genre.color} shadow-lg shadow-${genre.color.split('-')[1]}-500/20 scale-[1.02] border-transparent`
                                    : 'bg-gray-800/50 hover:bg-gray-700/50 border border-white/5 hover:border-white/10'
                                }
                                ${!isSelected && selectedGenres.length >= 3 ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
                            `}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{genre.name}</span>
                                <span className={`text-xl transition-transform duration-300 ${isSelected ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                                    {genre.emoji}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
