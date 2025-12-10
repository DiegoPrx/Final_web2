'use client';

import { useState } from 'react';

const MOODS = [
    { id: 'happy', name: 'Feliz / Positivo', emoji: '😊', params: { min_valence: 0.7, min_energy: 0.6 } },
    { id: 'sad', name: 'Melancólico / Triste', emoji: '😢', params: { max_valence: 0.4, max_energy: 0.4 } },
    { id: 'energetic', name: 'Energético / Fiesta', emoji: '⚡', params: { min_energy: 0.8, min_danceability: 0.7 } },
    { id: 'calm', name: 'Calmado / Relax', emoji: '😌', params: { max_energy: 0.4, max_danceability: 0.4 } },
    { id: 'focus', name: 'Concentración', emoji: '🧠', params: { max_speechiness: 0.3, min_instrumentalness: 0.5 } }
];

export default function MoodWidget({ onSelect }) {
    const [selectedMood, setSelectedMood] = useState(null);

    const handleMoodClick = (mood) => {
        if (selectedMood === mood.id) {
            setSelectedMood(null);
            onSelect(null);
        } else {
            setSelectedMood(mood.id);
            onSelect(mood.params);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-1">😊 Estado de Ánimo</h3>
            <p className="text-gray-400 text-sm mb-4">¿Cómo te sientes hoy?</p>

            <div className="grid grid-cols-1 gap-3">
                {MOODS.map((mood) => {
                    const isSelected = selectedMood === mood.id;
                    return (
                        <button
                            key={mood.id}
                            onClick={() => handleMoodClick(mood)}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isSelected
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <span className="text-2xl">{mood.emoji}</span>
                            <span className="font-medium">{mood.name}</span>
                            {isSelected && <span className="ml-auto text-xl">✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
