'use client';

export default function PopularityWidget({ popularityRange, onSelect }) {
    const handleChange = (e) => {
        // En un slider simple, asumimos que el usuario elige el "mínimo" de popularidad
        const val = parseInt(e.target.value);
        onSelect([val, 100]);
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-full">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🔥</span> Popularidad
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                    {popularityRange[0] === 0 ? 'Cualquier cosa' :
                        popularityRange[0] < 50 ? 'Incluir algunas joyas ocultas' :
                            'Solo Mainstream / éxitos'}
                </p>
            </div>

            <div className="relative pt-2 px-2">
                <input
                    type="range"
                    min="0"
                    max="80"
                    step="10"
                    value={popularityRange[0]}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
                />

                <div className="flex justify-between mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span>Underground</span>
                    <span>Hits Mundiales</span>
                </div>
            </div>
        </div>
    );
}
