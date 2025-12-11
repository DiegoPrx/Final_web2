'use client';

const decades = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];

export default function DecadeWidget({ selectedDecades = [], onSelect }) {
    const toggleDecade = (decade) => {
        if (selectedDecades.includes(decade)) {
            onSelect(selectedDecades.filter(d => d !== decade));
        } else {
            onSelect([...selectedDecades, decade]);
        }
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">📅</span> Década
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Viaja en el tiempo</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {decades.map((decade) => {
                    const isSelected = selectedDecades.includes(decade);
                    return (
                        <button
                            key={decade}
                            onClick={() => toggleDecade(decade)}
                            className={`
                                px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 border
                                ${isSelected
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow-lg shadow-green-900/30 transform scale-105'
                                    : 'bg-gray-800/50 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                                }
                            `}
                        >
                            {decade}s
                        </button>
                    );
                })}
            </div>
            {selectedDecades.length > 0 && (
                <div className="mt-4 text-xs text-center text-green-400 font-mono">
                    {selectedDecades.sort().join(' • ')}
                </div>
            )}
        </div>
    );
}
