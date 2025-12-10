'use client';

const DECADES = ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'];

export default function DecadeWidget({ selectedDecades = [], onSelect }) {

    const handleDecadeClick = (decade) => {
        if (selectedDecades.includes(decade)) {
            // Deseleccionar
            onSelect(selectedDecades.filter(d => d !== decade));
        } else {
            // Seleccionar
            onSelect([...selectedDecades, decade]);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-1">📅 Décadas</h3>
            <p className="text-gray-400 text-sm mb-4">Elige las épocas que te gustan</p>

            {/* Grid de décadas */}
            <div className="grid grid-cols-2 gap-3">
                {DECADES.map((decade) => {
                    const isSelected = selectedDecades.includes(decade);
                    return (
                        <button
                            key={decade}
                            onClick={() => handleDecadeClick(decade)}
                            className={`p-4 rounded-xl text-center transition-all transform hover:scale-105 ${isSelected
                                    ? 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <div className="text-2xl font-bold">{decade}s</div>
                            <div className="text-xs mt-1 opacity-80">
                                {decade}-{parseInt(decade) + 9}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Contador */}
            {selectedDecades.length > 0 && (
                <div className="mt-4 text-sm text-green-400 text-center">
                    {selectedDecades.length} década{selectedDecades.length > 1 ? 's' : ''} seleccionada{selectedDecades.length > 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
}
