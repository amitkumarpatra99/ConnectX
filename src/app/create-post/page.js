'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaImage, FaTimes } from 'react-icons/fa';

export default function CreatePost() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content && !image) return;
        setLoading(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, image }),
            });
            if (res.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="px-2 pt-2 mb-5">
                <h1 className="text-2xl font-bold gradient-text select-none">Create Post</h1>
            </div>

            <div className="glass rounded-2xl p-6 relative overflow-hidden">
                {/* Gradient top bar */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cx-gradient rounded-t-2xl" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <textarea
                        className="cx-input resize-y min-h-[140px] leading-relaxed"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                    />

                    {preview && (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/10">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImage(null);
                                    setPreview(null);
                                }}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-ig-red text-white p-1.5 rounded-full transition-colors"
                            >
                                <FaTimes size={12} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-1">
                        <label className="cursor-pointer flex items-center gap-2 text-ig-secondary hover:text-cx-blue transition-colors group">
                            <FaImage size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Add Photo</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>

                        <button
                            type="submit"
                            disabled={(!content && !image) || loading}
                            className="cx-button text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Posting...
                                </span>
                            ) : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
