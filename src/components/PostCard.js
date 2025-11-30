'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function PostCard({ post }) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(post.likes || []);
    const [comments, setComments] = useState(post.comments || []);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const isLiked = session && likes.includes(session.user.id);

    useEffect(() => {
        if (session?.user?.id) {
            checkSaveStatus();
        }
    }, [session, post._id]);

    const checkSaveStatus = async () => {
        try {
            const res = await fetch(`/api/users/${session.user.id}`);
            if (res.ok) {
                const user = await res.json();
                if (user.savedPosts && user.savedPosts.includes(post._id)) {
                    setIsSaved(true);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        if (!session) return;
        try {
            const res = await fetch(`/api/posts/${post._id}/save`, {
                method: 'POST',
            });
            if (res.ok) {
                const data = await res.json();
                setIsSaved(data.isSaved);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = async () => {
        if (!session) return;
        try {
            const res = await fetch(`/api/posts/${post._id}/like`, {
                method: 'POST',
            });
            if (res.ok) {
                const newLikes = await res.json();
                setLikes(newLikes);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!session || !commentText.trim()) return;

        try {
            const res = await fetch(`/api/posts/${post._id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText }),
            });
            if (res.ok) {
                const newComments = await res.json();
                setComments(newComments);
                setCommentText('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="glass-panel rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-metal-800 flex items-center justify-center overflow-hidden border border-metal-600 shadow-inner relative">
                        {post.author?.image ? (
                            <Image
                                src={post.author.image}
                                alt={post.author.name || 'User'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="font-bold text-metal-400">{post.author?.name?.[0]?.toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-metal-100">{post.author?.name}</h3>
                        <p className="text-xs text-metal-500">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                    </div>
                </div>
            </div>

            <p className="text-metal-200 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

            {post.image && (
                <div className="mb-4 rounded-lg overflow-hidden border border-metal-700/50 shadow-lg">
                    <Image
                        src={post.image}
                        alt="Post content"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
            )}

            <div className="flex items-center justify-between border-t border-metal-700/50 pt-4">
                <div className="flex gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-metal-400 hover:text-red-400'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        {likes.length}
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-sm font-medium text-metal-400 hover:text-blue-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        {comments.length}
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isSaved ? 'text-yellow-500' : 'text-metal-400 hover:text-yellow-400'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-metal-700/50">
                    {comments.map((comment, index) => (
                        <div key={index} className="mb-2 text-sm">
                            <span className="font-bold text-metal-200 mr-2">{comment.author?.name || 'User'}</span>
                            <span className="text-metal-400">{comment.text}</span>
                        </div>
                    ))}

                    {session && (
                        <form onSubmit={handleComment} className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-metal-800/50 border border-metal-600 rounded-full px-4 py-2 text-sm text-metal-100 placeholder:text-metal-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="text-blue-400 font-medium text-sm disabled:opacity-50 hover:text-blue-300 transition-colors px-2"
                            >
                                Post
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
