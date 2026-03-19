'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (res.error) {
                setError('Invalid email or password. Please try again.');
                return;
            }
            router.push('/');
            router.refresh();
        } catch (err) {
            console.log(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[90vh] px-4">
            <div className="w-full max-w-md animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold gradient-text mb-2 select-none">ConnectX</h1>
                    <p className="text-ig-secondary text-sm">Connect with the world</p>
                </div>

                {/* Card */}
                <div className="glass rounded-3xl p-8 shadow-card">
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 w-full h-[2px] rounded-t-3xl bg-cx-gradient" />

                    <h2 className="text-xl font-bold text-ig-primary mb-6 text-center">Welcome back</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ig-secondary" size={15} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="cx-input pl-11"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ig-secondary" size={15} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="cx-input pl-11"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="cx-button w-full disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-ig-secondary">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-cx-blue hover:text-cx-purple font-semibold transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
