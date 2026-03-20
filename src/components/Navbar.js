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
        <nav className="sticky top-0 z-50 glass-dark border-b border-white/[0.06] mb-8">
            <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity tracking-wide select-none">
                    ConnectX
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
                            className="cx-input text-sm"
                        />
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full glass rounded-xl shadow-card overflow-hidden z-50">
                                {searchResults.map((user) => (
                                    <Link
                                        key={user._id}
                                        href={`/profile/${user._id}`}
                                        className="flex items-center gap-3 p-3 hover:bg-white/[0.06] transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-ig-elevated flex items-center justify-center overflow-hidden border border-white/10">
                                            {user.image ? (
                                                <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold text-ig-secondary">{user.username[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-ig-primary">{user.username}</span>
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
                                <Link href="/create-post" className="flex items-center gap-2 text-ig-secondary hover:text-ig-primary font-medium transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="hidden sm:inline">Create</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="flex items-center gap-2 text-ig-secondary hover:text-ig-primary font-medium transition-colors">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-cx-gradient flex items-center justify-center text-white text-sm font-bold">
                                            {session.user?.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm font-medium text-ig-red hover:text-red-400 transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/login" className="text-ig-secondary hover:text-ig-primary font-medium transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="cx-button text-sm">
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
