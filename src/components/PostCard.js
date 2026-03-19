'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaRegComment, FaRegPaperPlane, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

export default function PostCard({ post }) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(post.likes || []);
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [likeAnimating, setLikeAnimating] = useState(false);
    const [lastTap, setLastTap] = useState(0);

    const isLiked = session && likes.includes(session.user.id);

    const triggerLikeAnimation = () => {
        setLikeAnimating(true);
        setTimeout(() => setLikeAnimating(false), 400);
    };

    const handleLike = async () => {
        if (!session) return;
        triggerLikeAnimation();
        const originalLikes = [...likes];
        if (isLiked) {
            setLikes(likes.filter(id => id !== session.user.id));
        } else {
            setLikes([...likes, session.user.id]);
        }
        try {
            const res = await fetch(`/api/posts/${post._id}/like`, { method: 'POST' });
            if (!res.ok) {
                setLikes(originalLikes);
            } else {
                const updatedLikes = await res.json();
                setLikes(updatedLikes);
            }
        } catch {
            setLikes(originalLikes);
        }
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        if (now - lastTap < 350) {
            if (!isLiked) handleLike();
        }
        setLastTap(now);
    };

    const handleSave = async () => {
        if (!session) return;
        setIsSaved(!isSaved);
        try {
            const res = await fetch(`/api/posts/${post._id}/save`, { method: 'POST' });
            if (!res.ok) {
                setIsSaved(!isSaved);
            } else {
                const data = await res.json();
                setIsSaved(data.isSaved);
            }
        } catch {
            setIsSaved(!isSaved);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !session) return;
        const newCommentText = commentText;
        setCommentText('');
        try {
            const res = await fetch(`/api/posts/${post._id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newCommentText }),
            });
            if (res.ok) {
                const updatedComments = await res.json();
                setComments(updatedComments);
            }
        } catch (error) {
            console.error('Failed to comment', error);
        }
    };

    return (
        <div className="bg-ig-black border border-white/[0.06] rounded-2xl mb-4 overflow-hidden shadow-card hover:border-white/[0.1] transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${post.author?._id}`} className="block">
                        <div className="relative w-9 h-9">
                            <div className="absolute inset-0 rounded-full bg-ig-gradient p-[1.5px]">
                                <div className="w-full h-full rounded-full bg-ig-black p-[1px]">
                                    <div className="w-full h-full rounded-full bg-ig-elevated overflow-hidden relative">
                                        {post.author?.image ? (
                                            <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-ig-secondary">
                                                {post.author?.name?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <div>
                        <Link href={`/profile/${post.author?._id}`} className="text-sm font-semibold text-ig-primary hover:text-cx-blue transition-colors">
                            {post.author?.name}
                        </Link>
                        <div className="text-ig-secondary text-[11px]">
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                        </div>
                    </div>
                </div>
                <button className="text-ig-secondary hover:text-ig-primary transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.05]">
                    <BsThreeDots size={18} />
                </button>
            </div>

            {/* Image with double-tap support */}
            <div
                className="relative w-full aspect-square bg-ig-elevated cursor-pointer"
                onDoubleClick={handleDoubleTap}
                onClick={handleDoubleTap}
            >
                {post.image ? (
                    <Image
                        src={post.image}
                        alt="Post content"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-ig-secondary text-sm">
                        No Image
                    </div>
                )}
                {post.content && !post.image && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <p className="text-ig-primary text-center text-lg font-medium leading-relaxed">{post.content}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className="hover:opacity-80 transition-opacity"
                    >
                        {isLiked ? (
                            <FaHeart
                                size={26}
                                className={`text-ig-red ${likeAnimating ? 'animate-like-pop' : ''}`}
                            />
                        ) : (
                            <FaRegHeart
                                size={26}
                                className={`text-ig-primary ${likeAnimating ? 'animate-like-pop' : ''}`}
                            />
                        )}
                    </button>
                    <button className="hover:opacity-80 transition-opacity text-ig-primary hover:text-cx-blue">
                        <FaRegComment size={25} />
                    </button>
                    <button className="hover:opacity-80 transition-opacity text-ig-primary hover:text-cx-blue">
                        <FaRegPaperPlane size={24} />
                    </button>
                </div>
                <button onClick={handleSave} className="hover:opacity-80 transition-opacity text-ig-primary">
                    {isSaved ? <FaBookmark size={24} className="text-cx-blue" /> : <FaRegBookmark size={24} />}
                </button>
            </div>

            {/* Likes count */}
            <div className="px-4 text-sm font-semibold text-ig-primary mb-2">
                {likes.length.toLocaleString()} {likes.length === 1 ? 'like' : 'likes'}
            </div>

            {/* Caption */}
            {post.content && (
                <div className="px-4 text-sm mb-2">
                    <span className="font-semibold text-ig-primary mr-2">{post.author?.name}</span>
                    <span className="text-ig-secondary">{post.content}</span>
                </div>
            )}

            {/* Comments */}
            {comments.length > 0 && (
                <div className="px-4 max-h-16 overflow-y-auto mb-2 scrollbar-hide">
                    {comments.slice(0, 3).map((comment, index) => (
                        <div key={index} className="text-sm mb-1">
                            <span className="font-semibold text-ig-primary mr-2">{comment.author?.username || comment.author?.name || 'User'}</span>
                            <span className="text-ig-secondary">{comment.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {comments.length > 3 && (
                <button className="px-4 text-sm text-ig-secondary mb-2 hover:text-ig-primary transition-colors">
                    View all {comments.length} comments
                </button>
            )}

            {/* Add Comment */}
            {session && (
                <form onSubmit={handleComment} className="px-4 py-3 flex items-center border-t border-white/[0.04]">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="bg-transparent text-sm w-full focus:outline-none placeholder-ig-secondary/60 text-ig-primary"
                    />
                    <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="text-cx-blue font-semibold text-sm disabled:opacity-30 ml-2 hover:text-cx-purple transition-colors whitespace-nowrap"
                    >
                        Post
                    </button>
                </form>
            )}
        </div>
    );
}
