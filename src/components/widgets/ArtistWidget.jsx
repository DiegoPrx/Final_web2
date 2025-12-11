'use client';

import { useState, useEffect } from 'react';
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
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleArtistClick = (artist) => {
        if (selectedArtists.find(a => a.id === artist.id)) {
            onSelect(selectedArtists.filter(a => a.id !== artist.id));
        } else {
            if (selectedArtists.length < 5) {
                onSelect([...selectedArtists, artist]);
            }
        }
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🎤</span> Artistas
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Busca hasta 5 ídolos</p>
                </div>
                <div className="bg-gray-800/50 px-3 py-1 rounded-full text-xs font-mono text-gray-300 border border-white/5">
                    {selectedArtists.length}/5
                </div>
            </div>

            <input
                type="text"
                placeholder="Escribe para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-white/10 text-white px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all placeholder-gray-500"
            />

            {/* Selected Artists Chips */}
            {selectedArtists.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedArtists.map(artist => (
                        <div key={artist.id} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full pl-1 pr-3 py-1 shadow-lg shadow-green-900/20">
                            <img
                                src={artist.images?.[2]?.url || artist.images?.[0]?.url || '/default-artist.png'}
                                alt={artist.name}
                                className="w-6 h-6 rounded-full border border-white/20"
                            />
                            <span className="text-white text-xs font-medium">{artist.name}</span>
                            <button
                                onClick={() => handleArtistClick(artist)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto pr-2 min-h-[200px] space-y-2 custom-scrollbar">
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner size="md" />
                    </div>
                )}

                {!isLoading && !error && results.length === 0 && searchTerm && (
                    <div className="text-gray-500 text-center py-8 text-sm">No encontramos ese artista 😕</div>
                )}

                {!isLoading && !error && results.length > 0 && (
                    results.map((artist) => {
                        const isSelected = selectedArtists.find(a => a.id === artist.id);
                        const canSelect = !isSelected && selectedArtists.length < 5;

                        return (
                            <button
                                key={artist.id}
                                onClick={() => handleArtistClick(artist)}
                                disabled={!isSelected && selectedArtists.length >= 5}
                                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group ${isSelected
                                    ? 'bg-green-500/20 border border-green-500/50'
                                    : canSelect
                                        ? 'bg-gray-800/30 hover:bg-gray-800 border border-transparent hover:border-white/10'
                                        : 'opacity-40 cursor-not-allowed'
                                    }`}
                            >
                                <img
                                    src={artist.images?.[2]?.url || artist.images?.[0]?.url || '/default-artist.png'}
                                    alt={artist.name}
                                    className={`w-12 h-12 rounded-lg object-cover shadow-sm transition-transform ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                                />
                                <div className="flex-1 text-left">
                                    <div className={`font-semibold text-sm ${isSelected ? 'text-green-400' : 'text-white'}`}>{artist.name}</div>
                                    <div className="text-xs text-gray-400 truncate max-w-[150px]">
                                        {artist.genres?.slice(0, 2).join(', ') || 'Artista'}
                                    </div>
                                </div>
                                {isSelected && <div className="text-green-400 text-lg">✓</div>}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
