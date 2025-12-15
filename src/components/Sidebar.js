'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaRegCompass, FaRegHeart, FaRegPlusSquare, FaBars } from 'react-icons/fa';
import { BiMoviePlay, BiMessageRoundedDots } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const menuItems = [
        { label: 'Home', icon: <FaHome size={24} />, href: '/' },
        { label: 'Search', icon: <FaSearch size={24} />, href: '/search' },
        { label: 'Explore', icon: <FaRegCompass size={24} />, href: '/explore' },
        { label: 'Reels', icon: <BiMoviePlay size={24} />, href: '/reels' },
        { label: 'Messages', icon: <BiMessageRoundedDots size={24} />, href: '/messages' },
        { label: 'Notifications', icon: <FaRegHeart size={24} />, href: '/notifications' },
        { label: 'Create', icon: <FaRegPlusSquare size={24} />, href: '/create-post' },
        {
            label: 'Profile',
            icon: session?.user?.image ? (
                <img src={session.user.image} className="w-6 h-6 rounded-full" alt="Profile" />
            ) : <CgProfile size={24} />,
            href: '/profile'
        },
    ];

    return (
        <div className="hidden md:flex flex-col h-screen w-[245px] fixed left-0 top-0 border-r border-ig-stroke bg-ig-black p-4 z-50">
            {/* Logo */}
            <div className="px-3 mb-8 mt-2">
                <Link href="/" className="text-2xl font-bold tracking-wide">ConnectX</Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-ig-elevated transition-colors group ${isActive ? 'font-bold' : ''}`}
                        >
                            <span className={`group-hover:scale-110 transition-transform ${isActive ? 'scale-105' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-[16px]">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* More Menu */}
            <div className="mt-auto relative">
                {showMoreMenu && (
                    <div className="absolute bottom-full left-0 w-full bg-ig-elevated rounded-xl shadow-lg border border-ig-stroke mb-2 overflow-hidden">
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left px-4 py-3 hover:bg-zinc-700 text-sm font-semibold text-ig-red"
                        >
                            Log out
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-zinc-700 text-sm">
                            Settings
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-zinc-700 text-sm">
                            Saved
                        </button>
                    </div>
                )}
                <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="flex items-center gap-4 px-3 py-3 w-full rounded-lg hover:bg-ig-elevated transition-colors text-left"
                >
                    <FaBars size={24} />
                    <span className="text-[16px] font-bold">More</span>
                </button>
            </div>
        </div>
    );
}
