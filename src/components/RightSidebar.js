'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { FaFire, FaUsers, FaHashtag } from 'react-icons/fa';

const AVATAR_GRADIENTS = [
    'from-pink-500 to-yellow-500',
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-green-400 to-teal-500',
    'from-orange-500 to-red-500',
];

const TRENDING = [
    { tag: '#WebDev', posts: '48.2K posts' },
    { tag: '#AITools', posts: '32.1K posts' },
    { tag: '#UIDesign', posts: '27.5K posts' },
];

export default function RightSidebar() {
    const { data: session } = useSession();
    const [followedUsers, setFollowedUsers] = useState({});

    const suggestions = [
        { id: 1, username: 'adobexd', subtitle: 'Popular creator' },
        { id: 2, username: 'figma', subtitle: 'Followed by user1 + 2 more' },
        { id: 3, username: 'sketchapp', subtitle: 'Suggested for you' },
        { id: 4, username: 'ui_gradient', subtitle: 'New to ConnectX' },
        { id: 5, username: 'webdesign_ideas', subtitle: 'Followed by dev_guru' },
    ];

    const toggleFollow = (id) => {
        setFollowedUsers(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!session) return null;

    return (
        <div className="hidden lg:block w-[320px] pl-8 py-8 pr-4 fixed right-0 top-0 h-screen overflow-y-auto scrollbar-hide">
            {/* User Profile */}
            <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full bg-cx-gradient p-[2px]">
                            <div className="w-full h-full rounded-full bg-ig-black overflow-hidden">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-ig-secondary font-bold bg-ig-elevated">
                                        {session.user?.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="font-semibold text-sm text-ig-primary">{session.user?.name}</div>
                        <div className="text-ig-secondary text-xs">{session.user?.email?.split('@')[0]}</div>
                    </div>
                </div>
                <button className="text-xs font-bold text-cx-blue hover:text-cx-purple transition-colors">Switch</button>
            </div>

            {/* Suggestions */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-ig-secondary font-semibold text-sm flex items-center gap-2">
                    <FaUsers size={14} /> Suggested for you
                </div>
                <Link href="/explore" className="text-ig-primary hover:text-cx-blue text-xs font-semibold transition-colors">See All</Link>
            </div>

            <div className="space-y-3 mb-8">
                {suggestions.map((user, i) => (
                    <div key={user.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                                {user.username[0].toUpperCase()}
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-ig-primary group-hover:text-cx-blue transition-colors cursor-pointer">{user.username}</div>
                                <div className="text-xs text-ig-secondary truncate w-[130px]">{user.subtitle}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleFollow(user.id)}
                            className={`text-xs font-bold transition-all ${
                                followedUsers[user.id]
                                    ? 'text-ig-secondary'
                                    : 'text-cx-blue hover:text-cx-purple'
                            }`}
                        >
                            {followedUsers[user.id] ? 'Following' : 'Follow'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Trending */}
            <div className="mb-3">
                <div className="text-ig-secondary font-semibold text-sm flex items-center gap-2 mb-3">
                    <FaFire size={14} className="text-orange-400" /> Trending on ConnectX
                </div>
                <div className="space-y-2">
                    {TRENDING.map((t) => (
                        <div key={t.tag} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-cx-gradient/10 flex items-center justify-center">
                                <FaHashtag size={12} className="text-cx-blue" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-ig-primary group-hover:text-cx-blue transition-colors">{t.tag}</div>
                                <div className="text-xs text-ig-secondary">{t.posts}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-[11px] text-ig-secondary/40 flex flex-wrap gap-x-2 gap-y-1">
                {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms'].map(l => (
                    <span key={l} className="hover:text-ig-secondary cursor-pointer transition-colors">{l}</span>
                ))}
                <span className="w-full mt-1">© 2025 ConnectX</span>
            </div>
        </div>
    );
}
