'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Header({ userName }) {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-green-400">🎵 Taste Mixer</h1>
                </div>

                <div className="flex items-center gap-4">
                    {userName && (
                        <span className="text-gray-300 hidden md:block">
                            <span className="text-gray-500">Hola,</span> {userName}
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors text-sm"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    );
}
