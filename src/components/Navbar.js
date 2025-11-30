'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim()) {
                try {
                    const res = await fetch(`/api/users/search?q=${searchQuery}`);
                    const data = await res.json();
                    setSearchResults(data);
                    setShowResults(true);
                } catch (error) {
                    console.error(error);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <nav className="sticky top-0 z-50 glass-panel border-b-0 mb-8">
            <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold metal-text hover:opacity-80 transition-opacity tracking-wide">
                    SocialApp
                </Link>

                {session && (
                    <div className="relative hidden md:block w-96">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            className="w-full px-4 py-2 bg-metal-800/50 border border-metal-600 rounded-full text-sm text-metal-100 placeholder:text-metal-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-metal-900 border border-metal-700 rounded-xl shadow-xl overflow-hidden z-50">
                                {searchResults.map((user) => (
                                    <Link
                                        key={user._id}
                                        href={`/profile/${user._id}`}
                                        className="flex items-center gap-3 p-3 hover:bg-metal-800 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-metal-700 flex items-center justify-center overflow-hidden border border-metal-600">
                                            {user.image ? (
                                                <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold text-metal-300">{user.username[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-metal-200">{user.username}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <ul className="flex items-center gap-6">
                    {session ? (
                        <>
                            <li>
                                <Link href="/create-post" className="flex items-center gap-2 text-metal-300 hover:text-white font-medium transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="hidden sm:inline">Create</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="flex items-center gap-2 text-metal-300 hover:text-white font-medium transition-colors">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-metal-500" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-metal-700 to-metal-900 border border-metal-600 flex items-center justify-center text-metal-100 text-sm font-bold shadow-inner">
                                            {session.user?.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/login" className="text-metal-300 hover:text-white font-medium transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-metal-700 to-metal-800 text-metal-100 border border-metal-600 rounded-full font-medium hover:from-metal-600 hover:to-metal-700 transition-all shadow-lg hover:shadow-metal">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
