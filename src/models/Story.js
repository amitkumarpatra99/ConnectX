import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // 24 hours from now
        expires: 0, // MongoDB TTL index to automatically remove expired documents
    }
}, { timestamps: true });

// Prevent Mongoose model recompilation error
export default mongoose.models.Story || mongoose.model('Story', StorySchema);
