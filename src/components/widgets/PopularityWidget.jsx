'use client';

import { useState } from 'react';

const CATEGORIES = [
    { name: 'Mainstream', range: [80, 100], emoji: '🔥' },
    { name: 'Popular', range: [50, 80], emoji: '⭐' },
    { name: 'Underground', range: [0, 50], emoji: '💎' }
];

export default function PopularityWidget({ popularityRange = [0, 100], onSelect }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.name);
        onSelect(category.range);
    };

    const handleReset = () => {
        setSelectedCategory(null);
        onSelect([0, 100]);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-1">📊 Popularidad</h3>
            <p className="text-gray-400 text-sm mb-4">Hits o joyas ocultas</p>

            {/* Categorías */}
            <div className="space-y-3 mb-4">
                {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    return (
                        <button
                            key={category.name}
                            onClick={() => handleCategoryClick(category)}
                            className={`w-full p-4 rounded-lg text-left transition-all ${isSelected
                                    ? 'bg-green-600 text-white ring-2 ring-green-400'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{category.emoji}</span>
                                    <div>
                                        <div className="font-semibold">{category.name}</div>
                                        <div className="text-sm opacity-75">
                                            Popularidad: {category.range[0]}-{category.range[1]}
                                        </div>
                                    </div>
                                </div>
                                {isSelected && <div className="text-xl">✓</div>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Rango actual */}
            <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400 mb-1">Rango seleccionado</div>
                <div className="text-lg font-bold text-white">
                    {popularityRange[0]} - {popularityRange[1]}
                </div>
            </div>

            {/* Botón reset */}
            {selectedCategory && (
                <button
                    onClick={handleReset}
                    className="w-full mt-3 text-gray-400 hover:text-white text-sm transition-colors"
                >
                    Restablecer (Todos)
                </button>
            )}
        </div>
    );
}
