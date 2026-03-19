'use client';

import Link from 'next/link';
import { FaRegHeart } from 'react-icons/fa';
import { BiMessageRoundedDots } from 'react-icons/bi';

export default function MobileHeader() {
    return (
        <div className="md:hidden sticky top-0 z-50 glass-dark border-b border-white/[0.06] px-5 h-[58px] flex justify-between items-center">
            <Link href="/" className="text-xl font-extrabold tracking-tight gradient-text select-none">
                ConnectX
            </Link>

            <div className="flex items-center gap-5 text-ig-primary">
                <Link
                    href="/notifications"
                    className="relative hover:text-cx-blue transition-colors"
                >
                    <FaRegHeart size={23} />
                </Link>
                <Link
                    href="/messages"
                    className="hover:text-cx-blue transition-colors"
                >
                    <BiMessageRoundedDots size={24} />
                </Link>
            </div>
        </div>
    );
}
