'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSearch, FaUser } from 'react-icons/fa';
import Link from 'next/link';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }

        // Debounce: wait 400ms after the user stops typing
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
                setSearched(true);
            }
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-2 px-2 pt-2 mb-5">
                <FaSearch size={18} className="text-cx-blue" />
                <h1 className="text-2xl font-bold gradient-text select-none">Search</h1>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ig-secondary" size={14} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people by username..."
                    className="cx-input pl-11"
                    autoFocus
                />
                {loading && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-cx-blue rounded-full animate-spin block" />
                    </span>
                )}
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="glass rounded-2xl overflow-hidden">
                    {results.map((user, i) => (
                        <Link
                            key={user._id}
                            href={`/profile/${user._id}`}
                            className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.05] transition-colors group ${
                                i !== results.length - 1 ? 'border-b border-white/[0.04]' : ''
                            }`}
                        >
                            {/* Avatar */}
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-ig-elevated flex-shrink-0">
                                {user.image ? (
                                    <Image src={user.image} alt={user.username} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-cx-gradient text-white text-sm font-bold">
                                        {user.username?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-ig-primary group-hover:text-cx-blue transition-colors truncate">
                                    {user.username}
                                </p>
                                {user.name && (
                                    <p className="text-xs text-ig-secondary truncate">{user.name}</p>
                                )}
                            </div>

                            <FaUser size={12} className="text-ig-secondary/40 group-hover:text-cx-blue/60 transition-colors flex-shrink-0" />
                        </Link>
                    ))}
                </div>
            )}

            {/* No results */}
            {searched && results.length === 0 && query.trim() && !loading && (
                <div className="glass rounded-2xl p-12 text-center animate-fade-in">
                    <FaSearch size={36} className="text-ig-secondary opacity-40 mx-auto mb-4" />
                    <p className="text-ig-primary font-semibold mb-1">No results found</p>
                    <p className="text-ig-secondary text-sm">
                        No users matching &quot;{query}&quot; were found.
                    </p>
                </div>
            )}

            {/* Initial empty state */}
            {!query && !searched && (
                <div className="text-center py-16 animate-fade-in">
                    <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-5">
                        <FaSearch size={32} className="text-ig-secondary" />
                    </div>
                    <p className="text-ig-primary font-bold text-lg mb-2">Find people</p>
                    <p className="text-ig-secondary text-sm max-w-xs mx-auto">
                        Search for users by their username to view their profiles.
                    </p>
                </div>
            )}
        </div>
    );
}
