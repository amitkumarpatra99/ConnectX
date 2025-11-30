import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        default: '',
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false,
    },
    image: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
        maxlength: [160, 'Bio cannot be more than 160 characters'],
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
