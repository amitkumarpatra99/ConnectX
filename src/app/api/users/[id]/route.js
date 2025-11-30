import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        await dbConnect();

        // Await params before accessing properties (Next.js 15+ requirement)
        const { id } = await params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        if (session.user.id !== id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { name, username, bio, image } = await req.json();

        // Validate username uniqueness if changed
        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: id } });
            if (existingUser) {
                return NextResponse.json({ message: 'Username already taken' }, { status: 400 });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, username, bio, image },
            { new: true, runValidators: true }
        ).select('-password');

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
