'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Stories() {
    const { data: session } = useSession();
    const [stories, setStories] = useState([]);
    const [viewingStory, setViewingStory] = useState(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);


    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch('/api/stories');
                if (res.ok) {
                    const data = await res.json();
                    setStories(data);
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };
        fetchStories();
    }, []);

    // Animate progress bar when viewing a story
    useEffect(() => {
        if (!viewingStory) return;
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setViewingStory(null), 300);
                    return 100;
                }
                return prev + 0.5;
            });
        }, 25);
        return () => clearInterval(interval);
    }, [viewingStory, currentStoryIndex]);

    const handleCreateStory = async () => {
        if (!session) return;
        const imageUrl = window.prompt("Enter image URL for your story:", "https://picsum.photos/400/600");
        if (!imageUrl) return;
        try {
            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageUrl }),
            });
            if (res.ok) {
                const updatedRes = await fetch('/api/stories');
                if (updatedRes.ok) setStories(await updatedRes.json());
            } else {
                alert("Failed to create story");
            }
        } catch (error) {
            console.error("Error creating story:", error);
        }
    };

    return (
        <>
            {/* Stories Row */}
            <div className="flex gap-4 overflow-x-auto pb-3 mb-2 scrollbar-hide px-1">
                {/* Add Story */}
                <button
                    onClick={handleCreateStory}
                    className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer group"
                >
                    <div className="relative w-[60px] h-[60px] rounded-full bg-ig-elevated border-2 border-dashed border-ig-stroke group-hover:border-cx-blue/50 transition-colors flex items-center justify-center overflow-hidden">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Your story" className="w-full h-full object-cover opacity-60" />
                        ) : (
                            <span className="text-ig-secondary text-2xl font-light group-hover:text-cx-blue transition-colors">+</span>
                        )}
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-cx-blue rounded-full border-2 border-ig-black flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">+</span>
                        </div>
                    </div>
                    <span className="text-[11px] text-ig-secondary truncate w-16 text-center">Your story</span>
                </button>

                {/* Stories List */}
                {stories.map((userStories) => (
                    <button
                        key={userStories.user._id}
                        className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer"
                        onClick={() => { setViewingStory(userStories); setCurrentStoryIndex(0); }}
                    >
                        {/* Story Ring */}
                        <div className="story-ring w-[64px] h-[64px] rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-[58px] h-[58px] rounded-full bg-ig-black p-[2px]">
                                <div className="w-full h-full rounded-full bg-ig-elevated overflow-hidden">
                                    {userStories.user.image ? (
                                        <img src={userStories.user.image} alt={userStories.user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                                            {userStories.user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-[11px] text-ig-primary truncate w-16 text-center">
                            {userStories.user.username}
                        </span>
                    </button>
                ))}
            </div>

            {/* Story Viewer Modal */}
            {viewingStory && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
                    onClick={() => setViewingStory(null)}
                >
                    <div
                        className="relative w-full max-w-[380px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Progress Bar */}
                        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                            {viewingStory.stories.map((_, i) => (
                                <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-none"
                                        style={{ width: i < currentStoryIndex ? '100%' : i === currentStoryIndex ? `${progress}%` : '0%' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* User Info */}
                        <div className="absolute top-8 left-3 right-3 z-20 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/60 flex-shrink-0">
                                {viewingStory.user.image ? (
                                    <img src={viewingStory.user.image} alt={viewingStory.user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold bg-ig-elevated">
                                        {viewingStory.user.username[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="text-white font-semibold text-sm drop-shadow-lg">{viewingStory.user.username}</span>
                        </div>

                        {/* Story Image */}
                        <img
                            src={viewingStory.stories[currentStoryIndex]?.image || viewingStory.stories[viewingStory.stories.length - 1].image}
                            alt="Story"
                            className="w-full h-full object-cover"
                        />

                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            className="absolute top-8 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                            onClick={() => setViewingStory(null)}
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
