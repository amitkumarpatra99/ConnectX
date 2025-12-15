'use client';

import Link from 'next/link';
import { FaRegHeart } from 'react-icons/fa';
import { BiMessageRoundedDots } from 'react-icons/bi';

export default function MobileHeader() {
    return (
        <div className="md:hidden sticky top-0 z-50 bg-ig-black border-b border-ig-stroke px-4 h-[60px] flex justify-between items-center transition-transform duration-300">
            <Link href="/" className="text-xl font-bold tracking-wide text-ig-primary">
                ConnectX
            </Link>

            <div className="flex items-center gap-5 text-ig-primary">
                <Link href="/notifications">
                    <FaRegHeart size={24} />
                </Link>
                <Link href="/messages">
                    <BiMessageRoundedDots size={24} />
                </Link>
            </div>
        </div>
    );
}
