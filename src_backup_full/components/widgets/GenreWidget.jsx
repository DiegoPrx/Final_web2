'use client';

import { useState } from 'react';

const GENRES = [
    'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
    'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
    'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
    'children', 'chill', 'classical', 'club', 'comedy',
    'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
    'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
    'dubstep', 'edm', 'electro', 'electronic', 'emo',
    'folk', 'forro', 'french', 'funk', 'garage',
    'german', 'gospel', 'goth', 'grindcore', 'groove',
    'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
    'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm',
    'indian', 'indie', 'indie-pop', 'industrial', 'iranian',
    'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz',
    'k-pop', 'kids', 'latin', 'latino', 'malay',
    'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
    'movies', 'mpb', 'new-age', 'new-release', 'opera',
    'pagode', 'party', 'philippines-opm', 'piano', 'pop',
    'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock',
    'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae',
    'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
    'romance', 'sad', 'salsa', 'samba', 'sertanejo',
    'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter',
    'soul', 'soundtracks', 'spanish', 'study', 'summer',
    'swedish', 'synth-pop', 'tango', 'techno', 'trance',
    'trip-hop', 'turkish', 'work-out', 'world-music'
];

export default function GenreWidget({ selectedGenres = [], onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar géneros por búsqueda
    const filteredGenres = GENRES.filter(genre =>
        genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGenreClick = (genre) => {
        if (selectedGenres.includes(genre)) {
            // Deseleccionar
            onSelect(selectedGenres.filter(g => g !== genre));
        } else {
            // Seleccionar (máximo 5)
            if (selectedGenres.length < 5) {
                onSelect([...selectedGenres, genre]);
            }
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-1">🎸 Géneros</h3>
            <p className="text-gray-400 text-sm mb-4">Selecciona hasta 5 géneros</p>

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar género..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Contador */}
            <div className="text-sm text-gray-400 mb-3">
                {selectedGenres.length} / 5 seleccionados
            </div>

            {/* Grid de géneros */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                {filteredGenres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                        <button
                            key={genre}
                            onClick={() => handleGenreClick(genre)}
                            disabled={!isSelected && selectedGenres.length >= 5}
                            className={`px-3 py-2 rounded-lg text-sm transition-all ${isSelected
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                } ${!isSelected && selectedGenres.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {genre}
                        </button>
                    );
                })}
            </div>

            {filteredGenres.length === 0 && (
                <p className="text-gray-500 text-center py-4">No se encontraron géneros</p>
            )}
        </div>
    );
}
