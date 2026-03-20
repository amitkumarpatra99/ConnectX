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
                    if (!userRes.ok) return;
                    const userData = await userRes.json();
                    setUser(userData);
                    const followers = userData.followers || [];
                    setFollowersCount(followers.length);

                    if (session) {
                        setIsFollowing(followers.includes(session.user.id));
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

        const prevFollowing = isFollowing;
        const prevCount = followersCount;

        setIsFollowing(!isFollowing);
        setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);

        try {
            const res = await fetch(`/api/users/${id}/follow`, { method: 'POST' });
            if (!res.ok) {
                setIsFollowing(prevFollowing);
                setFollowersCount(prevCount);
            } else {
                const data = await res.json();
                setIsFollowing(data.isFollowing);
                setFollowersCount(data.followersCount);
            }
        } catch (error) {
            console.error(error);
            setIsFollowing(prevFollowing);
            setFollowersCount(prevCount);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cx-blue"></div>
        </div>
    );

    if (!user) return <div className="text-center py-20 text-ig-secondary">User not found.</div>;

    const isMe = session?.user?.id === id;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Profile Card */}
            <div className="glass rounded-2xl p-8 mb-8 flex flex-col items-center text-center relative overflow-hidden">
                {/* Gradient top bar */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cx-gradient rounded-t-2xl pointer-events-none" />

                {/* Avatar */}
                <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden bg-ig-elevated mb-4 border-2 border-white/10 shadow-xl">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-cx-gradient text-white text-4xl font-bold">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>

                <h1 className="relative z-10 text-2xl font-bold text-ig-primary mb-1">{user.name}</h1>
                <p className="relative z-10 text-ig-secondary mb-6">{user.email}</p>

                {/* Stats */}
                <div className="relative z-10 flex gap-8 border-t border-white/[0.06] pt-6 w-full justify-center mb-6">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-ig-primary">{posts.length}</span>
                        <span className="text-sm text-ig-secondary">Posts</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-ig-primary">{followersCount}</span>
                        <span className="text-sm text-ig-secondary">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-ig-primary">{user.following?.length || 0}</span>
                        <span className="text-sm text-ig-secondary">Following</span>
                    </div>
                </div>

                {/* Action button */}
                {isMe ? (
                    <Link
                        href="/profile/edit"
                        className="relative z-10 px-6 py-2 border border-white/20 text-ig-primary rounded-full text-sm font-semibold hover:bg-white/[0.06] transition-all"
                    >
                        Edit Profile
                    </Link>
                ) : (
                    <button
                        onClick={handleFollow}
                        className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
                            isFollowing
                                ? 'border border-white/20 text-ig-primary hover:border-ig-red hover:text-ig-red'
                                : 'cx-button'
                        }`}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            {/* Posts */}
            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                    <div className="glass rounded-xl p-10 text-center">
                        <p className="text-ig-secondary">No posts yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
