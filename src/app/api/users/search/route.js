import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json([]);
        }

        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        }).select('username image _id').limit(10);

        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
