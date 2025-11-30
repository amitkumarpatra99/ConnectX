'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import Image from 'next/image';

export default function Profile() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ followers: 0, following: 0 });

    const [activeTab, setActiveTab] = useState('posts');
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const fetchData = async () => {
                try {
                    // Fetch posts
                    const postsRes = await fetch(`/api/posts?author=${session.user.id}`);
                    const postsData = await postsRes.json();
                    setPosts(postsData);

                    // Fetch user stats and saved posts
                    const userRes = await fetch(`/api/users/${session.user.id}`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setStats({
                            followers: userData.followers?.length || 0,
                            following: userData.following?.length || 0
                        });

                        // Fetch full saved posts details
                        if (userData.savedPosts?.length > 0) {
                            // We need an endpoint to fetch specific posts by IDs, or filter client side if we had all
                            // Let's assume we can fetch them. For now, let's just fetch all and filter (inefficient but works for demo)
                            // Better: Add endpoint support.
                            // Let's create a quick helper or just fetch all global and filter.
                            const allPostsRes = await fetch('/api/posts');
                            const allPosts = await allPostsRes.json();
                            const saved = allPosts.filter(p => userData.savedPosts.includes(p._id));
                            setSavedPosts(saved);
                        }
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status, session]);

    if (status === 'loading' || loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!session) {
        return <div className="text-center py-20 text-slate-600">Please login to view your profile.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-8 rounded-2xl mb-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-metal-800/50 to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden bg-metal-800 mb-4 border-4 border-metal-700 shadow-xl">
                    {session.user.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-metal-700 to-metal-900 text-metal-100 text-4xl font-bold">
                            {session.user.name?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
                <h1 className="relative z-10 text-2xl font-bold text-metal-100 mb-1">{session.user.name}</h1>
                <p className="relative z-10 text-metal-400 mb-6">{session.user.email}</p>

                <div className="relative z-10 flex gap-8 border-t border-metal-700/50 pt-6 w-full justify-center mb-6">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-metal-100">{posts.length}</span>
                        <span className="text-sm text-metal-500">Posts</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-metal-100">{stats.followers}</span>
                        <span className="text-sm text-metal-500">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-metal-100">{stats.following}</span>
                        <span className="text-sm text-metal-500">Following</span>
                    </div>
                </div>

                <Link href="/profile/edit" className="px-6 py-2 bg-metal-800 hover:bg-metal-700 border border-metal-600 text-metal-200 rounded-full text-sm font-medium transition-all relative z-10">
                    Edit Profile
                </Link>
            </div>

            <div className="flex border-b border-metal-700/50 mb-6">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'posts' ? 'text-blue-400' : 'text-metal-400 hover:text-metal-200'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        POSTS
                    </span>
                    {activeTab === 'posts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'saved' ? 'text-blue-400' : 'text-metal-400 hover:text-metal-200'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                        SAVED
                    </span>
                    {activeTab === 'saved' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
                </button>
            </div>

            <div className="space-y-6">
                {activeTab === 'posts' ? (
                    posts.length > 0 ? (
                        posts.map((post) => <PostCard key={post._id} post={post} />)
                    ) : (
                        <div className="glass-panel rounded-xl p-10 text-center">
                            <p className="text-metal-400">You haven't posted anything yet.</p>
                        </div>
                    )
                ) : (
                    savedPosts.length > 0 ? (
                        savedPosts.map((post) => <PostCard key={post._id} post={post} />)
                    ) : (
                        <div className="glass-panel rounded-xl p-10 text-center">
                            <p className="text-metal-400">No saved posts yet.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
