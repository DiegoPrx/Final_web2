'use client';

import { useState } from 'react';

const MOODS = [
    { id: 'happy', name: 'Feliz', emoji: '😄', color: 'bg-amber-400', params: { min_valence: 0.7, min_energy: 0.6 } },
    { id: 'sad', name: 'Melancólico', emoji: '🌧️', color: 'bg-blue-800', params: { max_valence: 0.4, max_energy: 0.4 } },
    { id: 'energetic', name: 'Energético', emoji: '⚡', color: 'bg-yellow-400', params: { min_energy: 0.8, min_danceability: 0.7 } },
    { id: 'chill', name: 'Chill', emoji: '☕', color: 'bg-green-700', params: { max_energy: 0.4, max_danceability: 0.4 } },
    { id: 'party', name: 'Fiesta', emoji: '🎉', color: 'bg-purple-600', params: { min_danceability: 0.8, min_energy: 0.7 } },
    { id: 'focus', name: 'Concentración', emoji: '🧠', color: 'bg-cyan-600', params: { max_speechiness: 0.3, min_instrumentalness: 0.5 } },
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
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🎭</span> Mood
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">¿Cómo te sientes hoy?</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {MOODS.map((mood) => {
                    const isSelected = selectedMood === mood.id;
                    return (
                        <button
                            key={mood.id}
                            onClick={() => handleMoodClick(mood)}
                            className={`
                                flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300
                                ${isSelected
                                    ? 'bg-white text-gray-900 shadow-lg scale-105 ring-2 ring-white/50'
                                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-white/5'
                                }
                            `}
                        >
                            <span className={`text-3xl mb-2 transition-transform duration-300 ${isSelected ? 'scale-125' : ''}`}>
                                {mood.emoji}
                            </span>
                            <span className="text-sm font-bold">{mood.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
