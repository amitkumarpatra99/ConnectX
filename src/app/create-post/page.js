'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreatePost() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
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

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, image }),
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-xl">
            <h1 className="text-2xl font-bold text-metal-100 mb-6 border-b border-metal-700/50 pb-4">Create Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    className="w-full p-4 bg-metal-800/50 border border-metal-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-y min-h-[150px] text-metal-100 placeholder:text-metal-500 transition-all"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                />

                {preview && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-metal-600">
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
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <label className="cursor-pointer flex items-center gap-2 text-metal-300 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-sm font-medium">Add Photo</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>

                    <button
                        type="submit"
                        disabled={!content && !image}
                        className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
