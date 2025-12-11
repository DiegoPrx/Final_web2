'use client';

import { useState, useEffect } from 'react';
import { searchTracks } from '@/lib/spotify';
import LoadingSpinner from '../LoadingSpinner';

export default function TrackWidget({ selectedTracks = [], onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const tracks = await searchTracks(searchTerm);
                setResults(tracks);
            } catch (err) {
                setError('Error al buscar canciones');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

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
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🎵</span> Canciones
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Elige hasta 5 semillas</p>
                </div>
                <div className="bg-gray-800/50 px-3 py-1 rounded-full text-xs font-mono text-gray-300 border border-white/5">
                    {selectedTracks.length}/5
                </div>
            </div>

            <input
                type="text"
                placeholder="Busca tu canción favorita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-white/10 text-white px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all placeholder-gray-500"
            />

            {/* Selected Tracks Chips */}
            {selectedTracks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTracks.map(track => (
                        <div key={track.id} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full pl-1 pr-3 py-1 shadow-lg shadow-purple-900/20">
                            <img
                                src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                                alt={track.name}
                                className="w-6 h-6 rounded-full border border-white/20"
                            />
                            <div className="flex flex-col leading-none">
                                <span className="text-white text-xs font-medium max-w-[80px] truncate">{track.name}</span>
                            </div>
                            <button
                                onClick={() => handleTrackClick(track)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Results */}
            <div className="flex-1 overflow-y-auto pr-2 min-h-[200px] space-y-2 custom-scrollbar">
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner size="sm" />
                    </div>
                )}

                {!isLoading && results.length > 0 && (
                    results.map((track) => {
                        const isSelected = selectedTracks.find(t => t.id === track.id);
                        const canSelect = !isSelected && selectedTracks.length < 5;

                        return (
                            <button
                                key={track.id}
                                onClick={() => handleTrackClick(track)}
                                disabled={!isSelected && selectedTracks.length >= 5}
                                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group ${isSelected
                                    ? 'bg-purple-500/20 border border-purple-500/50'
                                    : canSelect
                                        ? 'bg-gray-800/30 hover:bg-gray-800 border border-transparent hover:border-white/10'
                                        : 'opacity-40 cursor-not-allowed'
                                    }`}
                            >
                                <img
                                    src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                                    alt={track.name}
                                    className={`w-10 h-10 rounded-lg shadow-sm transition-transform ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                                />
                                <div className="flex-1 text-left min-w-0">
                                    <div className={`font-semibold text-sm truncate ${isSelected ? 'text-purple-300' : 'text-white'}`}>{track.name}</div>
                                    <div className="text-xs text-gray-400 truncate">
                                        {track.artists?.map(a => a.name).join(', ')}
                                    </div>
                                </div>
                                {isSelected && <div className="text-purple-400 text-lg">✓</div>}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
