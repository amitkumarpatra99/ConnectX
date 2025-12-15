'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaRegComment, FaRegPaperPlane, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

export default function PostCard({ post }) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(post.likes || []);
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const isLiked = session && likes.includes(session.user.id);

    // Mock functionality for demo purposes
    // In a real app, these would be API calls
    const handleLike = () => {
        if (!session) return;
        if (isLiked) {
            setLikes(likes.filter(id => id !== session.user.id));
        } else {
            setLikes([...likes, session.user.id]);
        }
    };

    const handleSave = () => setIsSaved(!isSaved);

    const handleComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setComments([...comments, { text: commentText, author: { name: session.user.name } }]);
        setCommentText('');
    };

    return (
        <div className="bg-ig-black border-b border-ig-stroke mb-4 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ig-elevated overflow-hidden border border-ig-stroke relative">
                        {post.author?.image ? (
                            <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-ig-secondary">
                                {post.author?.name?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="text-sm font-semibold">{post.author?.name}</div>
                    <span className="text-ig-secondary text-xs">• {formatDistanceToNow(new Date(post.createdAt))}</span>
                </div>
                <button className="text-ig-primary hover:text-ig-secondary">
                    <BsThreeDots size={20} />
                </button>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-square bg-ig-elevated">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt="Post content"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-ig-secondary">
                        No Image
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-4">
                    <button onClick={handleLike} className="hover:opacity-70 transition-opacity">
                        {isLiked ? <FaHeart size={24} className="text-ig-red" /> : <FaRegHeart size={24} />}
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                        <FaRegComment size={24} />
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                        <FaRegPaperPlane size={24} />
                    </button>
                </div>
                <button onClick={handleSave} className="hover:opacity-70 transition-opacity">
                    {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
                </button>
            </div>

            {/* Likes */}
            <div className="px-3 text-sm font-semibold mb-2">
                {likes.length} likes
            </div>

            {/* Caption */}
            <div className="px-3 text-sm mb-2">
                <span className="font-semibold mr-2">{post.author?.name}</span>
                <span className="text-ig-primary">{post.content}</span>
            </div>

            {/* Comments Link */}
            {comments.length > 0 && (
                <button className="px-3 text-sm text-ig-secondary mb-2 hover:text-ig-primary">
                    View all {comments.length} comments
                </button>
            )}

            {/* Add Comment */}
            <form onSubmit={handleComment} className="px-3 flex items-center border-t border-ig-elevated pt-3 mt-2">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="bg-transparent text-sm w-full focus:outline-none placeholder-ig-secondary"
                />
                <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="text-ig-link font-semibold text-sm disabled:opacity-50 ml-2"
                >
                    Post
                </button>
            </form>
        </div>
    );
}
