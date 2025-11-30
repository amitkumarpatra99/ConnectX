import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const author = searchParams.get('author');
        const type = searchParams.get('type');

        let query = {};
        if (author) {
            query.author = author;
        } else if (type === 'following') {
            const session = await getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }
            const user = await User.findById(session.user.id);
            if (user) {
                // Include user's own posts and posts from people they follow
                const following = user.following || [];
                query.author = { $in: [...following, session.user.id] };
            }
        }

        const posts = await Post.find(query)
            .populate('author', 'name username image')
            .populate('comments.author', 'name username image')
            .sort({ createdAt: -1 });

        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { content, image } = await req.json();

        if (!content && !image) {
            return NextResponse.json({ message: 'Content or image is required' }, { status: 400 });
        }

        console.log(`Creating post. Content: ${content}, Image length: ${image?.length}`);

        const newPost = await Post.create({
            content,
            image,
            author: session.user.id,
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Failed to create post' },
            { status: 500 }
        );
    }
}
