import dbConnect from '@/lib/db';
import Post from '@/models/Post';
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
        const { id } = await params;
        const userId = session.user.id;

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        return NextResponse.json(post.likes);
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to like post' },
            { status: 500 }
        );
    }
}
