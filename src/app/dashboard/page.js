'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { generatePlaylist, getUserProfile, createPlaylist, addTracksToPlaylist } from '@/lib/spotify';
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
    const [isSaving, setIsSaving] = useState(false);

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

    // Guardar en Spotify
    const handleSavePlaylist = async () => {
        if (!user || playlist.length === 0) return;

        setIsSaving(true);
        try {
            // 1. Crear playlist vacía
            const newPlaylist = await createPlaylist(user.id, `Mi Mix - ${new Date().toLocaleDateString()}`);

            // 2. Obtener URIs de las canciones
            const trackUris = playlist.map(track => track.uri);

            // 3. Añadir canciones
            await addTracksToPlaylist(newPlaylist.id, trackUris);

            alert('¡Playlist guardada en tu Spotify exitosamente!');
        } catch (error) {
            console.error('Error guardando playlist:', error);
            alert('Error al guardar la playlist. Intenta de nuevo.');
        } finally {
            setIsSaving(false);
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
        <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
            <div className="fixed inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-br from-green-900/20 via-black to-purple-900/20 pointer-events-none z-0"></div>

            <div className="relative z-10">
                <Header userName={user?.display_name} />

                <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-24 sm:py-28">
                    <div className="flex flex-col xl:flex-row gap-6">

                        {/* LEFT PANEL: CONTROLS (Bento Grid) */}
                        <div className="w-full xl:w-[450px] shrink-0 flex flex-col gap-4">
                            <div className="mb-2">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    🎛️ Mezclador
                                </h2>
                                <p className="text-gray-400 text-sm">Configura tu vibe perfecta</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <GenreWidget selectedGenres={selectedGenres} onSelect={setSelectedGenres} />
                                </div>
                                <div className="col-span-1">
                                    <MoodWidget onSelect={setSelectedMood} />
                                </div>
                                <div className="col-span-1">
                                    <DecadeWidget selectedDecades={selectedDecades} onSelect={setSelectedDecades} />
                                </div>
                                <div className="col-span-2">
                                    <PopularityWidget popularityRange={popularityRange} onSelect={setPopularityRange} />
                                </div>
                                <div className="col-span-2">
                                    <ArtistWidget selectedArtists={selectedArtists} onSelect={setSelectedArtists} />
                                </div>
                                <div className="col-span-2">
                                    <TrackWidget selectedTracks={selectedTracks} onSelect={setSelectedTracks} />
                                </div>
                            </div>

                            <button
                                onClick={handleGeneratePlaylist}
                                disabled={isLoadingPlaylist}
                                className="w-full mt-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-900/30 border border-white/10 group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                    {isLoadingPlaylist ? (
                                        <>
                                            <span className="animate-spin">🔄</span> Mezclando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="group-hover:animate-bounce">✨</span> Generar Mix
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>

                        {/* RIGHT PANEL: PLAYLIST RESULT */}
                        <div className="flex-1 min-h-[500px] xl:h-[calc(100vh-140px)] xl:sticky xl:top-28">
                            <PlaylistDisplay
                                playlist={playlist}
                                onRemoveTrack={handleRemoveTrack}
                                onToggleFavorite={handleToggleFavorite}
                                onRefresh={handleRefreshPlaylist}
                                onAddMore={handleAddMore}
                                onSave={handleSavePlaylist}
                                isLoading={isLoadingPlaylist || isSaving}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
