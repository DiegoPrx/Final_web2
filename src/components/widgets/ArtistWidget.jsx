'use client';

import { useState } from 'react';
// import { searchArtists } from '@/lib/spotify';
import LoadingSpinner from '../LoadingSpinner';

export default function ArtistWidget({ selectedArtists = [], onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');

    // TODO: Implementar búsqueda de artistas

    const handleArtistClick = (artist) => {
        if (selectedArtists.find(a => a.id === artist.id)) {
            // Deseleccionar
            onSelect(selectedArtists.filter(a => a.id !== artist.id));
        } else {
            // Seleccionar (máximo 5)
            if (selectedArtists.length < 5) {
                onSelect([...selectedArtists, artist]);
            }
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-1">🎤 Artistas</h3>
            <p className="text-gray-400 text-sm mb-4">Busca hasta 5 artistas</p>

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar artista (Desactivado)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Contador */}
            <div className="text-sm text-gray-400 mb-3">
                {selectedArtists.length} / 5 seleccionados
            </div>

            {/* Artistas seleccionados */}
            {selectedArtists.length > 0 && (
                <div className="mb-4 space-y-2">
                    {/* Renderizado de artistas seleccionados existente */}
                </div>
            )}

            {/* Resultados de búsqueda */}
            <div className="max-h-64 overflow-y-auto pr-2">
                <p className="text-gray-500 text-center py-2">Búsqueda desactivada en esta versión.</p>
            </div>
        </div>
    );
}
