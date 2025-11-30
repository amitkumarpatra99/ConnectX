'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts'); // Default fetches all posts (global)
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

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-metal-100 px-2 mb-6">Explore</h1>
            {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
                <div className="glass-panel rounded-xl p-10 text-center">
                    <p className="text-metal-400">No posts found.</p>
                </div>
            )}
        </div>
    );
}
