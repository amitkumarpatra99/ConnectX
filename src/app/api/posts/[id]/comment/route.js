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
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ message: 'Text is required' }, { status: 400 });
        }

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        const newComment = {
            text,
            author: session.user.id,
        };

        post.comments.push(newComment);
        await post.save();

        const updatedPost = await Post.findById(id).populate('comments.author', 'username image');

        return NextResponse.json(updatedPost.comments);
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to comment' },
            { status: 500 }
        );
    }
}
