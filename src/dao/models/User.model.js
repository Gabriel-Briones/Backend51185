import mongoose from 'mongoose';

const collection = 'User';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    name: String,
    email: String,
    age: Number,
    password: String,
    rol: String,
    cart: Array
})

const userModel = mongoose.model(collection, schema);

export default userModel;