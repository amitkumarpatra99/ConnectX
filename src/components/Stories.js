'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Stories() {
    const { data: session } = useSession();
    const [stories, setStories] = useState([]);
    const [showInput, setShowInput] = useState(false);

    // Fetch stories
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

    const handleCreateStory = async () => {
        if (!session) return;

        // For demo/simple implementation, we'll ask for an image URL
        // In a full app, this would use a file uploader
        const imageUrl = window.prompt("Enter image URL for your story:", "https://picsum.photos/400/600");

        if (!imageUrl) return;

        try {
            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageUrl }),
            });

            if (res.ok) {
                // Refresh stories
                const newStory = await res.json();
                // Simple re-fetch or state update. Since grouping logic is complex in backend, let's refetch.
                const updatedRes = await fetch('/api/stories');
                if (updatedRes.ok) {
                    const data = await updatedRes.json();
                    setStories(data);
                }
            } else {
                alert("Failed to create story");
            }
        } catch (error) {
            console.error("Error creating story:", error);
        }
    };

    const [viewingStory, setViewingStory] = useState(null);

    // ... existing useEffect ...

    // ... existing handleCreateStory ...

    return (
        <>
            <div className="flex gap-4 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                {/* User Story Add Button */}
                <div className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer" onClick={handleCreateStory}>
                    <div className={`p-[2px] rounded-full ${session ? 'bg-transparent' : 'bg-transparent'}`}>
                        <div className="p-[2px] bg-ig-black rounded-full">
                            <div className="w-14 h-14 rounded-full bg-ig-elevated overflow-hidden border border-ig-stroke flex items-center justify-center relative">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Story" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-ig-elevated flex items-center justify-center text-xs text-white font-bold">
                                        {session?.user?.name ? session.user.name[0].toUpperCase() : '+'}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 bg-blue-500 border-2 border-ig-black rounded-full w-4 h-4 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-ig-primary truncate w-16 text-center">
                        Your story
                    </span>
                </div>

                {/* Stories List */}
                {stories.map((userStories) => (
                    <div
                        key={userStories.user._id}
                        className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer"
                        onClick={() => setViewingStory(userStories)}
                    >
                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                            <div className="p-[2px] bg-ig-black rounded-full">
                                <div className="w-14 h-14 rounded-full bg-ig-elevated overflow-hidden border border-ig-stroke flex items-center justify-center relative">
                                    {userStories.user.image ? (
                                        <img src={userStories.user.image} alt={userStories.user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-ig-elevated flex items-center justify-center text-xs text-white font-bold">
                                            {userStories.user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-ig-primary truncate w-16 text-center">
                            {userStories.user.username}
                        </span>
                    </div>
                ))}
            </div>

            {/* Story Viewer Modal */}
            {viewingStory && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setViewingStory(null)}>
                    <div className="relative max-w-lg w-full aspect-[9/16] bg-black rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Progress Bar (Simple) */}
                        <div className="absolute top-2 left-2 right-2 h-1 bg-gray-600 rounded">
                            <div className="h-full bg-white rounded w-full"></div>
                        </div>

                        {/* User Info */}
                        <div className="absolute top-6 left-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                                {viewingStory.user.image ? (
                                    <img src={viewingStory.user.image} alt={viewingStory.user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold">
                                        {viewingStory.user.username[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="text-white font-semibold text-sm drop-shadow-md">{viewingStory.user.username}</span>
                        </div>

                        {/* Story Image */}
                        <img
                            src={viewingStory.stories[viewingStory.stories.length - 1].image}
                            alt="Story"
                            className="w-full h-full object-contain"
                        />

                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-4 text-white hover:opacity-75"
                            onClick={() => setViewingStory(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
