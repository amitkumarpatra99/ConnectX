'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaRegPlusSquare } from 'react-icons/fa';
import { BiMoviePlay } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { useSession } from 'next-auth/react';

export default function BottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { label: 'Home', icon: <FaHome size={24} />, href: '/' },
        { label: 'Explore', icon: <FaSearch size={24} />, href: '/explore' },
        { label: 'Create', icon: <FaRegPlusSquare size={24} />, href: '/create-post' },
        { label: 'Reels', icon: <BiMoviePlay size={24} />, href: '/reels' },
        {
            label: 'Profile',
            icon: session?.user?.image ? (
                <img src={session.user.image} className="w-6 h-6 rounded-full border border-ig-stroke" alt="Profile" />
            ) : <CgProfile size={24} />,
            href: '/profile'
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[50px] bg-ig-black border-t border-ig-stroke z-50 px-4 flex justify-between items-center text-ig-primary">
            {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-ig-primary' : 'text-ig-secondary'}`}
                    >
                        <span className={`${isActive ? 'scale-110' : ''}`}>
                            {item.icon}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
