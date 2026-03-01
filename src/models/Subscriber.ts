import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
    email: string;
    name?: string;
    active: boolean;
    subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        subscribedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Subscriber = mongoose.models.Subscriber ||
    mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
