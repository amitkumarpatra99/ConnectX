import dbConnect from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post'; // Ensure Post model is registered
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
        const { id: postId } = await params;
        const userId = session.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isSaved = user.savedPosts.includes(postId);

        if (isSaved) {
            // Unsave
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
        } else {
            // Save
            user.savedPosts.push(postId);
        }

        await user.save();

        return NextResponse.json({
            isSaved: !isSaved,
            savedPostsCount: user.savedPosts.length
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
