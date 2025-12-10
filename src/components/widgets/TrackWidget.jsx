'use client';

import { useState } from 'react';
// import { searchTracks } from '@/lib/spotify'; // Logic disabled
import LoadingSpinner from '../LoadingSpinner';

export default function TrackWidget({ selectedTracks = [], onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');

    // TODO: Implementar búsqueda de canciones


    const handleTrackClick = (track) => {
        if (selectedTracks.find(t => t.id === track.id)) {
            onSelect(selectedTracks.filter(t => t.id !== track.id));
        } else {
            if (selectedTracks.length < 5) {
                onSelect([...selectedTracks, track]);
            }
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-1">🎵 Canciones Base</h3>
            <p className="text-gray-400 text-sm mb-4">Elige hasta 5 canciones semilla</p>

            <input
                type="text"
                placeholder="Introduzca canción (Desactivado)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="text-sm text-gray-400 mb-3">
                {selectedTracks.length} / 5 seleccionadas
            </div>

            {selectedTracks.length > 0 && (
                <div className="mb-4 space-y-2">
                    {/* Renderizado de tracks seleccionados existente */}
                </div>
            )}

            <div className="max-h-64 overflow-y-auto pr-2">
                <p className="text-gray-500 text-center py-2">Búsqueda desactivada en esta versión.</p>
            </div>
        </div>
    );
}
