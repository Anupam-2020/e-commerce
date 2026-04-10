import mongoose, { Schema, Document } from "mongoose";


export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: any[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    idempotencyKey: string;
    retryCount: number;
    maxRetries: number;
    lastRetyAt?: Date;
}

const orderSchema = new Schema<IOrder>({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    items: [],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered"],
        default: "pending" 
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    idempotencyKey: {
        type: String,
        unique: true
    },
    retryCount: {
        type: Number,
        default: 0
    },
    maxRetries: {
        type: Number,
        default: 3
    },
    lastRetyAt: {
        type: Date
    }
}, { timestamps: true });


export const Order = mongoose.model<IOrder>("Order", orderSchema);