'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            🎵 Spotify Taste Mixer
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Crea playlists personalizadas basadas en tus gustos musicales
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Selecciona artistas, géneros, décadas y más. Nuestra IA generará la playlist perfecta para ti.
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
        >
          Iniciar sesión con Spotify
        </button>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-3">🎤</div>
            <h3 className="text-green-400 font-bold mb-2">Elige Artistas</h3>
            <p className="text-gray-400 text-sm">Busca y selecciona tus artistas favoritos</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-3">🎸</div>
            <h3 className="text-green-400 font-bold mb-2">Filtra por Género</h3>
            <p className="text-gray-400 text-sm">Más de 100 géneros disponibles</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-3">🎼</div>
            <h3 className="text-green-400 font-bold mb-2">Genera Playlist</h3>
            <p className="text-gray-400 text-sm">Obtén recomendaciones personalizadas</p>
          </div>
        </div>
      </div>
    </div>
  );
}


