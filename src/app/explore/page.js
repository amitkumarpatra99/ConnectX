'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { FaCompass, FaSearch } from 'react-icons/fa';

function SkeletonCard() {
    return (
        <div className="bg-ig-black border border-white/[0.06] rounded-2xl mb-4 overflow-hidden">
            <div className="flex items-center gap-3 p-4">
                <div className="skeleton w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-28 rounded" />
                    <div className="skeleton h-2 w-16 rounded" />
                </div>
            </div>
            <div className="skeleton aspect-square w-full" />
            <div className="p-4 space-y-2">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-3 w-full rounded" />
            </div>
        </div>
    );
}

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts');
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 px-2 pt-2 mb-5">
                <div className="flex items-center gap-2">
                    <FaCompass size={22} className="text-cx-blue" />
                    <h1 className="text-2xl font-bold gradient-text select-none">Explore</h1>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-5 px-1">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-ig-secondary" size={14} />
                <input
                    type="text"
                    placeholder="Search posts, people, topics..."
                    className="cx-input pl-10"
                    readOnly
                />
            </div>

            {/* Posts */}
            {loading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            ) : (
                <div className="glass rounded-2xl p-12 text-center animate-fade-in">
                    <FaCompass size={40} className="text-ig-secondary mx-auto mb-4 opacity-50" />
                    <p className="text-ig-primary font-semibold mb-1">Nothing to explore yet</p>
                    <p className="text-ig-secondary text-sm">Be the first to post something!</p>
                </div>
            )}
        </div>
    );
}
