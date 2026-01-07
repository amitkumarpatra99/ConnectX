import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Await params before using them (Next.js 15+ convention for dynamic routes)
        const { id: targetUserId } = await params;
        const currentUserId = session.user.id;

        if (targetUserId === currentUserId) {
            return NextResponse.json({ message: 'Cannot follow yourself' }, { status: 400 });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await Promise.all([currentUser.save(), targetUser.save()]);

        return NextResponse.json({
            isFollowing: !isFollowing,
            followersCount: targetUser.followers.length
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
