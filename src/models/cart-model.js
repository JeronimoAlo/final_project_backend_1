import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
            // Referencia al producto en la colección de productos.
            product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

export const CartModel = model('carts', cartSchema);
