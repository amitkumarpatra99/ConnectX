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

        // Await params before accessing properties (Next.js 15+ requirement)
        const { id: targetUserId } = await params;
        const currentUserId = session.user.id;

        if (targetUserId === currentUserId) {
            return NextResponse.json({ message: 'Cannot follow yourself' }, { status: 400 });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

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
