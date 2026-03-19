'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import Image from 'next/image';
import { FaThLarge, FaBookmark, FaEdit } from 'react-icons/fa';

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
                    const postsRes = await fetch(`/api/posts?author=${session.user.id}`);
                    const postsData = await postsRes.json();
                    setPosts(postsData);

                    const userRes = await fetch(`/api/users/${session.user.id}`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setStats({
                            followers: userData.followers?.length || 0,
                            following: userData.following?.length || 0,
                        });
                        if (userData.savedPosts?.length > 0) {
                            const allPostsRes = await fetch('/api/posts');
                            const allPosts = await allPostsRes.json();
                            setSavedPosts(allPosts.filter(p => userData.savedPosts.includes(p._id)));
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
        <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
            <div className="glass rounded-3xl p-8 flex flex-col items-center">
                <div className="skeleton w-24 h-24 rounded-full mb-4" />
                <div className="skeleton h-5 w-36 rounded mb-2" />
                <div className="skeleton h-3 w-48 rounded mb-6" />
                <div className="flex gap-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="text-center space-y-1">
                            <div className="skeleton h-6 w-10 rounded mx-auto" />
                            <div className="skeleton h-3 w-14 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="glass rounded-2xl p-10">
                    <p className="text-ig-primary font-semibold mb-2">Not logged in</p>
                    <p className="text-ig-secondary text-sm mb-5">Please sign in to view your profile.</p>
                    <Link href="/login" className="cx-button text-sm">Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Hero Card */}
            <div className="glass rounded-3xl mb-6 overflow-hidden shadow-card">
                {/* Gradient banner */}
                <div className="h-24 bg-cx-gradient opacity-60 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ig-black/80" />
                </div>

                <div className="px-6 pb-6 -mt-12 relative">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 mb-4">
                        <div className="absolute inset-0 rounded-full bg-cx-gradient p-[3px]">
                            <div className="w-full h-full rounded-full bg-ig-black p-[2px]">
                                <div className="w-full h-full rounded-full overflow-hidden bg-ig-elevated relative">
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-cx-gradient text-white text-3xl font-bold">
                                            {session.user.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-ig-primary">{session.user.name}</h1>
                            <p className="text-ig-secondary text-sm">{session.user.email}</p>
                        </div>
                        <Link
                            href="/profile/edit"
                            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-semibold text-ig-secondary hover:text-ig-primary transition-colors mt-2"
                        >
                            <FaEdit size={13} /> Edit
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mt-5 pt-5 border-t border-white/[0.06]">
                        {[
                            { label: 'Posts', value: posts.length },
                            { label: 'Followers', value: stats.followers },
                            { label: 'Following', value: stats.following },
                        ].map(({ label, value }) => (
                            <div key={label} className="text-center">
                                <span className="block text-xl font-bold text-ig-primary">{value.toLocaleString()}</span>
                                <span className="text-xs text-ig-secondary">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.06] mb-5">
                {[
                    { id: 'posts', label: 'POSTS', icon: <FaThLarge size={13} /> },
                    { id: 'saved', label: 'SAVED', icon: <FaBookmark size={13} /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 text-xs font-bold transition-colors relative flex items-center justify-center gap-1.5 ${
                            activeTab === tab.id ? 'text-ig-primary' : 'text-ig-secondary hover:text-ig-primary'
                        }`}
                    >
                        {tab.icon} {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cx-gradient rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-4 animate-fade-in">
                {activeTab === 'posts' ? (
                    posts.length > 0 ? (
                        posts.map((post) => <PostCard key={post._id} post={post} />)
                    ) : (
                        <div className="glass rounded-2xl p-12 text-center">
                            <FaThLarge size={32} className="text-ig-secondary opacity-40 mx-auto mb-3" />
                            <p className="text-ig-primary font-semibold">No posts yet</p>
                            <p className="text-ig-secondary text-sm mt-1">Share your first moment with the world.</p>
                            <Link href="/create-post" className="cx-button text-sm inline-block mt-5">Create Post</Link>
                        </div>
                    )
                ) : (
                    savedPosts.length > 0 ? (
                        savedPosts.map((post) => <PostCard key={post._id} post={post} />)
                    ) : (
                        <div className="glass rounded-2xl p-12 text-center">
                            <FaBookmark size={32} className="text-ig-secondary opacity-40 mx-auto mb-3" />
                            <p className="text-ig-primary font-semibold">No saved posts</p>
                            <p className="text-ig-secondary text-sm mt-1">Posts you save will appear here.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
