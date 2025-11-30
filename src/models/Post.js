import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please provide content'],
        maxlength: [500, 'Post cannot be more than 500 characters'],
    },
    image: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        text: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

// Prevent Mongoose model recompilation error in development
if (mongoose.models.Post) {
    delete mongoose.models.Post;
}

export default mongoose.model('Post', PostSchema);
