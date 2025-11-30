import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: 'An error occurred while registering the user.' },
            { status: 500 }
        );
    }
}
