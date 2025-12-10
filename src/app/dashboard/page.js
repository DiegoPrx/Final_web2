'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { generatePlaylist, getUserProfile } from '@/lib/spotify';
import { toggleFavorite } from '@/lib/favorites';

import Header from '@/components/Header';
import PlaylistDisplay from '@/components/PlaylistDisplay';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import TrackWidget from '@/components/widgets/TrackWidget';

export default function Dashboard() {
    const router = useRouter();

    // Estado del usuario
    const [user, setUser] = useState(null);

    // Estado de widgets
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedDecades, setSelectedDecades] = useState([]);
    const [popularityRange, setPopularityRange] = useState([0, 100]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [selectedMood, setSelectedMood] = useState(null);

    // Estado de playlist
    const [playlist, setPlaylist] = useState([]);
    const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

    // Verificar autenticación y obtener perfil
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/');
            return;
        }

        // Obtener perfil del usuario
        getUserProfile()
            .then(profile => setUser(profile))
            .catch(err => console.error('Error obteniendo perfil:', err));
    }, [router]);

    // Generar playlist
    const handleGeneratePlaylist = async () => {
        setIsLoadingPlaylist(true);

        try {
            const preferences = {
                artists: selectedArtists,
                genres: selectedGenres,
                decades: selectedDecades,
                popularity: popularityRange,
                tracks: selectedTracks,
                mood: selectedMood
            };

            const tracks = await generatePlaylist(preferences);
            setPlaylist(tracks);
        } catch (error) {
            console.error('Error generando playlist:', error);
            alert('Error al generar playlist. Intenta de nuevo.');
        } finally {
            setIsLoadingPlaylist(false);
        }
    };

    // Refrescar playlist con mismas preferencias
    const handleRefreshPlaylist = () => {
        handleGeneratePlaylist();
    };

    // Añadir más canciones
    const handleAddMore = async () => {
        setIsLoadingPlaylist(true);

        try {
            const preferences = {
                artists: selectedArtists,
                genres: selectedGenres,
                decades: selectedDecades,
                popularity: popularityRange,
                tracks: selectedTracks,
                mood: selectedMood
            };

            const newTracks = await generatePlaylist(preferences);

            // Combinar con playlist actual y eliminar duplicados
            const combined = [...playlist, ...newTracks];
            const unique = Array.from(
                new Map(combined.map(track => [track.id, track])).values()
            );

            setPlaylist(unique.slice(0, 50)); // Limitar a 50 total
        } catch (error) {
            console.error('Error añadiendo canciones:', error);
        } finally {
            setIsLoadingPlaylist(false);
        }
    };

    // Eliminar canción de playlist
    const handleRemoveTrack = (trackId) => {
        setPlaylist(playlist.filter(track => track.id !== trackId));
    };

    // Toggle favorito
    const handleToggleFavorite = (track) => {
        toggleFavorite(track);
        // Forzar re-render
        setPlaylist([...playlist]);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            <Header userName={user?.display_name} />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Título */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Personaliza tu Playlist
                    </h2>
                    <p className="text-gray-400">
                        Selecciona tus preferencias y genera una playlist única
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna de Widgets */}
                    <div className="lg:col-span-1 space-y-6">
                        <GenreWidget
                            selectedGenres={selectedGenres}
                            onSelect={setSelectedGenres}
                        />

                        <MoodWidget
                            onSelect={setSelectedMood}
                        />

                        <TrackWidget
                            selectedTracks={selectedTracks}
                            onSelect={setSelectedTracks}
                        />

                        <ArtistWidget
                            selectedArtists={selectedArtists}
                            onSelect={setSelectedArtists}
                        />

                        <DecadeWidget
                            selectedDecades={selectedDecades}
                            onSelect={setSelectedDecades}
                        />

                        <PopularityWidget
                            popularityRange={popularityRange}
                            onSelect={setPopularityRange}
                        />

                        {/* Botón Generar */}
                        <button
                            onClick={handleGeneratePlaylist}
                            disabled={isLoadingPlaylist}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                        >
                            {isLoadingPlaylist ? '🔄 Generando...' : '🎵 Generar Playlist'}
                        </button>
                    </div>

                    {/* Columna de Playlist */}
                    <div className="lg:col-span-2">
                        <PlaylistDisplay
                            playlist={playlist}
                            onRemoveTrack={handleRemoveTrack}
                            onToggleFavorite={handleToggleFavorite}
                            onRefresh={handleRefreshPlaylist}
                            onAddMore={handleAddMore}
                            isLoading={isLoadingPlaylist}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
