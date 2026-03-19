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
        { label: 'Home', icon: <FaHome size={22} />, href: '/' },
        { label: 'Explore', icon: <FaSearch size={22} />, href: '/explore' },
        { label: 'Create', icon: <FaRegPlusSquare size={22} />, href: '/create-post' },
        { label: 'Reels', icon: <BiMoviePlay size={22} />, href: '/reels' },
        {
            label: 'Profile',
            icon: session?.user?.image ? (
                <img src={session.user.image} className="w-6 h-6 rounded-full ring-2 ring-white/20" alt="Profile" />
            ) : <CgProfile size={22} />,
            href: '/profile'
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[56px] glass-dark border-t border-white/[0.06] z-50 px-2 flex justify-around items-center">
            {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-200 ${
                            isActive ? 'text-ig-primary' : 'text-ig-secondary'
                        }`}
                    >
                        {isActive && (
                            <span className="absolute bottom-auto top-0 w-8 h-0.5 rounded-full bg-cx-gradient mx-auto" />
                        )}
                        <span className={`transition-all duration-200 relative ${isActive ? 'scale-110' : 'scale-100'}`}>
                            {isActive && (
                                <span className="absolute inset-0 rounded-full bg-cx-blue/10 blur-md -z-10 scale-150" />
                            )}
                            {item.icon}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
