'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function UserProfile() {
    const { data: session } = useSession();
    const params = useParams();
    const id = params?.id;

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    // Fetch user details
                    const userRes = await fetch(`/api/users/${id}`);
                    if (!userRes.ok) return; // Handle error
                    const userData = await userRes.json();
                    setUser(userData);
                    setFollowersCount(userData.followers?.length || 0);

                    if (session) {
                        setIsFollowing(userData.followers.includes(session.user.id));
                    }

                    // Fetch posts
                    const postsRes = await fetch(`/api/posts?author=${id}`);
                    const postsData = await postsRes.json();
                    setPosts(postsData);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id, session]);

    const handleFollow = async () => {
        if (!session) return;

        // Optimistic UI
        const prevFollowing = isFollowing;
        const prevCount = followersCount;

        setIsFollowing(!isFollowing);
        setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);

        try {
            const res = await fetch(`/api/users/${id}/follow`, { method: 'POST' });
            if (!res.ok) {
                // Revert
                setIsFollowing(prevFollowing);
                setFollowersCount(prevCount);
            } else {
                const data = await res.json();
                setIsFollowing(data.isFollowing);
                setFollowersCount(data.followersCount);
            }
        } catch (error) {
            setIsFollowing(prevFollowing);
            setFollowersCount(prevCount);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return <div className="text-center py-20 text-slate-600">User not found.</div>;

    const isMe = session?.user?.id === id;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-8 rounded-2xl mb-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-metal-800/50 to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden bg-metal-800 mb-4 border-4 border-metal-700 shadow-xl">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-metal-700 to-metal-900 text-metal-100 text-4xl font-bold">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
                <h1 className="relative z-10 text-2xl font-bold text-metal-100 mb-1">{user.name}</h1>
                <p className="relative z-10 text-metal-400 mb-6">{user.email}</p>

                <div className="relative z-10 flex gap-8 border-t border-metal-700/50 pt-6 w-full justify-center mb-6">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-metal-100">{posts.length}</span>
                        <span className="text-sm text-metal-500">Posts</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-metal-100">{followersCount}</span>
                        <span className="text-sm text-metal-500">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-metal-100">{user.following?.length || 0}</span>
                        <span className="text-sm text-metal-500">Following</span>
                    </div>
                </div>

                {isMe ? (
                    <Link href="/profile/edit" className="px-6 py-2 bg-metal-800 hover:bg-metal-700 border border-metal-600 text-metal-200 rounded-full text-sm font-medium transition-all relative z-10">
                        Edit Profile
                    </Link>
                ) : (
                    <button
                        onClick={handleFollow}
                        className={`px-8 py-2 rounded-full text-sm font-semibold transition-all relative z-10 ${isFollowing
                                ? 'bg-transparent border border-metal-600 text-metal-200 hover:border-red-500 hover:text-red-500'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                    <div className="glass-panel rounded-xl p-10 text-center">
                        <p className="text-metal-400">No posts yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
