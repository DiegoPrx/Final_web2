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
        <header className="fixed w-full z-50 transition-all duration-300 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
                    <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-lg shadow-lg group-hover:shadow-green-500/50 transition-all">
                        <span className="text-xl">🎵</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Taste Mixer
                        </h1>
                        <span className="text-[10px] text-green-400 font-mono tracking-widest uppercase opacity-80">
                            Premium Edition
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {userName && (
                        <div className="flex items-center gap-3 bg-gray-800/50 pl-4 pr-1 py-1 rounded-full border border-white/5">
                            <span className="text-gray-300 text-sm hidden md:block">
                                <span className="opacity-60">Hola,</span> <span className="font-semibold text-white">{userName}</span>
                            </span>
                            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium px-2"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
}
