import mongoose from "mongoose";

const collection = "carts"

const schema = new mongoose.Schema({
    productos:
    {
        type: [
            {
                producto: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products"
                },
                qty: Number
            }
        ],
        default: []
    }

})

const cartModel = mongoose.model(collection, schema);

export default cartModel; 