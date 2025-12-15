'use client';

import { useSession } from 'next-auth/react';

export default function Stories() {
    const { data: session } = useSession();

    const stories = [
        { id: 1, username: 'your_story', isUser: true },
        { id: 2, username: 'travel_diaries', image: 'https://ui-avatars.com/api/?name=TD&background=random' },
        { id: 3, username: 'foodie_life', image: 'https://ui-avatars.com/api/?name=FL&background=random' },
        { id: 4, username: 'tech_news', image: 'https://ui-avatars.com/api/?name=TN&background=random' },
        { id: 5, username: 'art_gallery', image: 'https://ui-avatars.com/api/?name=AG&background=random' },
        { id: 6, username: 'fitness_pro', image: 'https://ui-avatars.com/api/?name=FP&background=random' },
        { id: 7, username: 'coding_daily', image: 'https://ui-avatars.com/api/?name=CD&background=random' },
        { id: 8, username: 'music_vibes', image: 'https://ui-avatars.com/api/?name=mV&background=random' },
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer">
                    <div className={`p-[2px] rounded-full ${story.isUser ? 'bg-transparent' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
                        <div className="p-[2px] bg-ig-black rounded-full">
                            <div className="w-14 h-14 rounded-full bg-ig-elevated overflow-hidden border border-ig-stroke flex items-center justify-center relative">
                                {story.isUser && session?.user?.image ? (
                                    <img src={session.user.image} alt="Story" className="w-full h-full object-cover" />
                                ) : story.image ? (
                                    <img src={story.image} alt={story.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-ig-elevated flex items-center justify-center text-xs text-white font-bold">
                                        {story.username[0].toUpperCase()}
                                    </div>
                                )}
                                {story.isUser && (
                                    <div className="absolute bottom-0 right-0 bg-blue-500 border-2 border-ig-black rounded-full w-4 h-4 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">+</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-ig-primary truncate w-16 text-center">
                        {story.isUser ? 'Your story' : story.username}
                    </span>
                </div>
            ))}
        </div>
    );
}
