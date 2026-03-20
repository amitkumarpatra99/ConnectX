'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await update();
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cx-blue"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="px-2 pt-2 mb-5">
                <h1 className="text-2xl font-bold gradient-text select-none">Edit Profile</h1>
            </div>

            <div className="glass rounded-2xl p-6 relative overflow-hidden">
                {/* Gradient top bar */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cx-gradient rounded-t-2xl" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-6 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-ig-elevated border-2 border-white/10 flex-shrink-0">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-ig-secondary bg-cx-gradient">
                                    {formData.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-ig-primary font-semibold mb-2">{formData.username}</h3>
                            <label className="cursor-pointer flex items-center gap-2 text-cx-blue hover:text-cx-purple font-medium text-sm transition-colors">
                                <FaCamera size={14} />
                                Change Profile Photo
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-ig-secondary mb-1.5">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Name"
                            className="cx-input"
                        />
                        <p className="text-xs text-ig-secondary/60 mt-1">Help people discover your account by using the name you&apos;re known by.</p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-ig-secondary mb-1.5">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Username"
                            className="cx-input"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-ig-secondary mb-1.5">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Write a short bio..."
                            rows={3}
                            maxLength={150}
                            className="cx-input resize-none"
                        />
                        <div className="text-right text-xs text-ig-secondary/50 mt-1">
                            {formData.bio.length} / 150
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 text-ig-secondary hover:text-ig-primary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="cx-button text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
