import dbConnect from '@/lib/db';
import Story from '@/models/Story';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
    try {
        await dbConnect();

        // Fetch active stories (expiry handled by TTL or query filter if needed)
        // Since we have TTL index, we can just fetch all. But for safety, let's filter too.
        const stories = await Story.find({
            expiresAt: { $gt: new Date() }
        })
            .populate('user', 'username image')
            .sort({ createdAt: -1 });

        // Group by user
        const storiesByUser = stories.reduce((acc, story) => {
            const userId = story.user._id.toString();
            if (!acc[userId]) {
                acc[userId] = {
                    user: story.user,
                    stories: []
                };
            }
            acc[userId].stories.push(story);
            return acc;
        }, {});

        return NextResponse.json(Object.values(storiesByUser));
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to fetch stories' },
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
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ message: 'Image is required' }, { status: 400 });
        }

        const story = await Story.create({
            user: session.user.id,
            image,
        });

        return NextResponse.json(story, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to create story' },
            { status: 500 }
        );
    }
}
