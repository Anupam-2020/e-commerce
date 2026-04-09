import mongoose, { Schema, Document} from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    category: string;
    stock: number;
    description?: string;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });


export const Product = mongoose.model<IProduct>("Product", productSchema);