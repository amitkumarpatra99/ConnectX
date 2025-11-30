'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setError('All fields are necessary.');
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.message);
            }
        } catch (error) {
            console.log('Error during registration: ', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <h1 className="text-2xl font-bold text-center mb-6 text-metal-100">Create Account</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-metal-300 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-metal-800/50 border border-metal-600 rounded-lg text-metal-100 placeholder:text-metal-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-metal-300 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-metal-800/50 border border-metal-600 rounded-lg text-metal-100 placeholder:text-metal-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-metal-300 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-metal-800/50 border border-metal-600 rounded-lg text-metal-100 placeholder:text-metal-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/50 p-2 rounded">{error}</p>}
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-900/20 mt-2">
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-metal-400">
                    Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
