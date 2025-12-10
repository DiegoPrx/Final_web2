'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchArtists } from '@/lib/spotify';
import LoadingSpinner from '../LoadingSpinner';

export default function ArtistWidget({ selectedArtists = [], onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debouncing para evitar muchas peticiones
    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const artists = await searchArtists(searchTerm);
                setResults(artists);
            } catch (err) {
                setError('Error al buscar artistas');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 500); // Esperar 500ms después de escribir

        return () => clearTimeout(timer);
    }, [searchTerm]);

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
                placeholder="Buscar artista..."
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
                    <div className="text-sm text-green-400 font-medium">Seleccionados:</div>
                    {selectedArtists.map(artist => (
                        <div key={artist.id} className="flex items-center gap-2 bg-green-600 rounded-lg p-2">
                            <img
                                src={artist.images?.[2]?.url || artist.images?.[0]?.url || '/default-artist.png'}
                                alt={artist.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="flex-1 text-white text-sm">{artist.name}</span>
                            <button
                                onClick={() => handleArtistClick(artist)}
                                className="text-white hover:text-red-300 text-lg"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Resultados de búsqueda */}
            <div className="max-h-64 overflow-y-auto pr-2">
                {isLoading && (
                    <div className="py-8">
                        <LoadingSpinner size="md" />
                    </div>
                )}

                {error && (
                    <div className="text-red-400 text-center py-4">{error}</div>
                )}

                {!isLoading && !error && results.length === 0 && searchTerm && (
                    <div className="text-gray-500 text-center py-4">No se encontraron artistas</div>
                )}

                {!isLoading && !error && results.length > 0 && (
                    <div className="space-y-2">
                        {results.map((artist) => {
                            const isSelected = selectedArtists.find(a => a.id === artist.id);
                            const canSelect = !isSelected && selectedArtists.length < 5;

                            return (
                                <button
                                    key={artist.id}
                                    onClick={() => handleArtistClick(artist)}
                                    disabled={!isSelected && selectedArtists.length >= 5}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${isSelected
                                        ? 'bg-green-600 text-white'
                                        : canSelect
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <img
                                        src={artist.images?.[2]?.url || artist.images?.[0]?.url || '/default-artist.png'}
                                        alt={artist.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1 text-left">
                                        <div className="font-medium">{artist.name}</div>
                                        {artist.genres && artist.genres.length > 0 && (
                                            <div className="text-xs opacity-75">{artist.genres.slice(0, 2).join(', ')}</div>
                                        )}
                                    </div>
                                    {isSelected && <div className="text-xl">✓</div>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
