'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaRegCompass, FaRegHeart, FaRegPlusSquare, FaBars, FaSignOutAlt, FaCog, FaBookmark } from 'react-icons/fa';
import { BiMoviePlay, BiMessageRoundedDots } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const menuItems = [
        { label: 'Home', icon: <FaHome size={22} />, href: '/' },
        { label: 'Search', icon: <FaSearch size={22} />, href: '/search' },
        { label: 'Explore', icon: <FaRegCompass size={22} />, href: '/explore' },
        { label: 'Reels', icon: <BiMoviePlay size={22} />, href: '/reels' },
        { label: 'Messages', icon: <BiMessageRoundedDots size={22} />, href: '/messages' },
        { label: 'Notifications', icon: <FaRegHeart size={22} />, href: '/notifications' },
        { label: 'Create', icon: <FaRegPlusSquare size={22} />, href: '/create-post' },
        {
            label: 'Profile',
            icon: session?.user?.image ? (
                <img src={session.user.image} className="w-6 h-6 rounded-full ring-2 ring-cx-purple/50" alt="Profile" />
            ) : <CgProfile size={22} />,
            href: '/profile'
        },
    ];

    return (
        <div className="hidden md:flex flex-col h-screen w-[245px] fixed left-0 top-0 border-r border-white/[0.06] bg-ig-black p-4 z-50">
            {/* Logo */}
            <div className="px-3 mb-8 mt-3">
                <Link href="/" className="text-2xl font-extrabold tracking-tight gradient-text select-none">
                    ConnectX
                </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-1">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                                isActive
                                    ? 'nav-active-pill font-bold'
                                    : 'hover:bg-white/[0.05]'
                            }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cx-gradient rounded-r-full" />
                            )}
                            <span className={`transition-all duration-200 group-hover:scale-110 ${isActive ? 'text-cx-blue' : 'text-ig-primary'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[15px] ${isActive ? 'text-ig-primary' : 'text-ig-secondary group-hover:text-ig-primary'} transition-colors`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* More Menu */}
            <div className="mt-auto relative">
                {showMoreMenu && (
                    <div className="absolute bottom-full left-0 w-full glass rounded-2xl shadow-card mb-3 overflow-hidden animate-slide-up">
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left px-4 py-3 hover:bg-white/[0.06] text-sm font-semibold text-ig-red flex items-center gap-3 transition-colors"
                        >
                            <FaSignOutAlt size={16} /> Log out
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white/[0.06] text-sm flex items-center gap-3 transition-colors text-ig-secondary hover:text-ig-primary">
                            <FaCog size={16} /> Settings
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white/[0.06] text-sm flex items-center gap-3 transition-colors text-ig-secondary hover:text-ig-primary">
                            <FaBookmark size={16} /> Saved
                        </button>
                    </div>
                )}
                <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="flex items-center gap-4 px-3 py-2.5 w-full rounded-xl hover:bg-white/[0.05] transition-all text-left group"
                >
                    <span className="text-ig-secondary group-hover:text-ig-primary transition-colors">
                        <FaBars size={22} />
                    </span>
                    <span className="text-[15px] font-bold text-ig-secondary group-hover:text-ig-primary transition-colors">More</span>
                </button>
            </div>
        </div>
    );
}
