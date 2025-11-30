'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditProfile() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        image: ''
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            fetchUserData();
        } else if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, session]);

    const fetchUserData = async () => {
        try {
            const res = await fetch(`/api/users/${session.user.id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || '',
                    username: data.username || '',
                    bio: data.bio || '',
                    image: data.image || ''
                });
                setPreview(data.image || null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/users/${session.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                // Update session to reflect changes immediately if possible, or just redirect
                await update(); // Attempt to update session
                router.push('/profile');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-8 rounded-2xl">
                <h1 className="text-2xl font-bold text-metal-100 mb-8 border-b border-metal-700/50 pb-4">Edit Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-6 p-4 bg-metal-800/30 rounded-xl border border-metal-700/30">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-metal-800 border-2 border-metal-600">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-metal-400">
                                    {formData.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-metal-100 font-medium mb-2">{formData.username}</h3>
                            <label className="cursor-pointer text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                Change Profile Photo
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-metal-300 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Name"
                            className="w-full px-4 py-2 bg-metal-800/50 border border-metal-600 rounded-lg text-metal-100 placeholder:text-metal-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                        />
                        <p className="text-xs text-metal-500 mt-1">Help people discover your account by using the name you're known by.</p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-metal-300 mb-1">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Username"
                            className="w-full px-4 py-2 bg-metal-800/50 border border-metal-600 rounded-lg text-metal-100 placeholder:text-metal-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-metal-300 mb-1">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Write a short bio..."
                            rows={3}
                            maxLength={150}
                            className="w-full px-4 py-2 bg-metal-800/50 border border-metal-600 rounded-lg text-metal-100 placeholder:text-metal-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all resize-none"
                        />
                        <div className="text-right text-xs text-metal-500 mt-1">
                            {formData.bio.length} / 150
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4 border-t border-metal-700/50">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 text-metal-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
