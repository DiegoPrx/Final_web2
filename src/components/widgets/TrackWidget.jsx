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
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-1">🎵 Canciones Base</h3>
            <p className="text-gray-400 text-sm mb-4">Elige hasta 5 canciones semilla</p>

            <input
                type="text"
                placeholder="Buscar canción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="text-sm text-gray-400 mb-3">
                {selectedTracks.length} / 5 seleccionadas
            </div>

            {selectedTracks.length > 0 && (
                <div className="mb-4 space-y-2">
                    {selectedTracks.map(track => (
                        <div key={track.id} className="flex items-center gap-2 bg-green-600 rounded-lg p-2">
                            <img
                                src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                                alt={track.name}
                                className="w-8 h-8 rounded"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-sm truncate">{track.name}</div>
                                <div className="text-green-200 text-xs truncate">{track.artists?.[0]?.name}</div>
                            </div>
                            <button
                                onClick={() => handleTrackClick(track)}
                                className="text-white hover:text-red-300 px-2"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="max-h-64 overflow-y-auto pr-2">
                {isLoading && <div className="py-4"><LoadingSpinner size="sm" /></div>}

                {!isLoading && results.length > 0 && (
                    <div className="space-y-2">
                        {results.map((track) => {
                            const isSelected = selectedTracks.find(t => t.id === track.id);
                            const canSelect = !isSelected && selectedTracks.length < 5;

                            return (
                                <button
                                    key={track.id}
                                    onClick={() => handleTrackClick(track)}
                                    disabled={!isSelected && selectedTracks.length >= 5}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${isSelected
                                        ? 'bg-green-600 text-white'
                                        : canSelect
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <img
                                        src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                                        alt={track.name}
                                        className="w-10 h-10 rounded"
                                    />
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-medium truncate">{track.name}</div>
                                        <div className="text-xs opacity-75 truncate">
                                            {track.artists?.map(a => a.name).join(', ')}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
