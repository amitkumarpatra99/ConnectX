'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import Stories from '@/components/Stories';
import { FaRegUser, FaCompass } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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
                <div className="skeleton h-3 w-3/4 rounded" />
            </div>
        </div>
    );
}

export default function Home() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const endpoint = session ? '/api/posts?type=following' : '/api/posts';
                const res = await fetch(endpoint);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [session]);

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center px-2 pt-2 mb-2">
                <h1 className="text-2xl font-bold gradient-text select-none">Home</h1>
                <Link
                    href="/explore"
                    className="flex items-center gap-1.5 text-cx-blue hover:text-cx-purple text-sm font-semibold transition-colors"
                >
                    <FaCompass size={14} /> Explore →
                </Link>
            </div>

            <Stories />

            {loading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            ) : posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                    <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6">
                        <FaRegUser size={40} className="text-ig-secondary" />
                    </div>
                    <p className="text-ig-primary font-bold text-lg mb-2">Welcome to ConnectX</p>
                    <p className="text-ig-secondary text-sm mb-8 max-w-xs">
                        Follow people to see their posts and stay connected.
                    </p>
                    <Link
                        href="/explore"
                        className="cx-button text-sm"
                    >
                        Discover People to Follow
                    </Link>
                </div>
            )}
        </div>
    );
}
