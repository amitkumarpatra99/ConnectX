'use client';

import { useSession } from 'next-auth/react';

export default function RightSidebar() {
    const { data: session } = useSession();

    const suggestions = [
        { id: 1, username: 'adobexd', subtitle: 'Popular' },
        { id: 2, username: 'figma', subtitle: 'Followed by user1 + 2 more' },
        { id: 3, username: 'sketchapp', subtitle: 'Suggested for you' },
        { id: 4, username: 'ui_gradient', subtitle: 'New to Instagram' },
        { id: 5, username: 'webdesign_ideas', subtitle: 'Followed by dev_guru' },
    ];

    if (!session) return null;

    return (
        <div className="hidden lg:block w-[320px] pl-8 py-8 pr-4 fixed right-0 top-0 h-screen">
            {/* User Profile Switch */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-ig-elevated overflow-hidden">
                        {session.user?.image ? (
                            <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-ig-secondary font-bold">
                                {session.user?.name?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-sm">{session.user?.name}</div>
                        <div className="text-ig-secondary text-sm">{session.user?.email?.split('@')[0]}</div>
                    </div>
                </div>
                <button className="text-ig-link hover:text-ig-primary text-xs font-semibold">Switch</button>
            </div>

            {/* Suggestions Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-ig-secondary font-semibold text-sm">Suggested for you</div>
                <button className="text-ig-primary hover:text-ig-secondary text-xs font-semibold">See All</button>
            </div>

            {/* Suggestions List */}
            <div className="space-y-4">
                {suggestions.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-ig-elevated overflow-hidden border border-ig-stroke">
                                {/* Placeholder Avatars */}
                                <div className={`w-full h-full bg-gradient-to-tr from-yellow-500 to-purple-600`}></div>
                            </div>
                            <div>
                                <div className="font-semibold text-sm">{user.username}</div>
                                <div className="text-xs text-ig-secondary truncate w-32">{user.subtitle}</div>
                            </div>
                        </div>
                        <button className="text-ig-link hover:text-ig-primary text-xs font-semibold">Follow</button>
                    </div>
                ))}
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-xs text-ig-elevated space-y-4">
                <p className="flex flex-wrap gap-1 opacity-50">
                    <span>About</span> &middot; <span>Help</span> &middot; <span>Press</span> &middot; <span>API</span> &middot; <span>Jobs</span> &middot; <span>Privacy</span> &middot; <span>Terms</span>
                </p>
                <p className="opacity-50">© 2025 INSTAGRAM CLONE FROM META</p>
            </div>
        </div>
    );
}
