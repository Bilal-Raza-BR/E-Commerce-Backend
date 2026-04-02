const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: String,
    age: Number,
    role: String
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    discount: Number,
    rating: Number,
    // reviews: Array(19),
    category: String,
    description: String,
    image: String,
}, { timestamps: true })

const modal= mongoose.model('signup-E-Commerce',userSchema);
const productModal = mongoose.model('productsData',productSchema)
// const womenProductModal = mongoose.model('women-products',womenProductSchema)


module.exports={ modal,productModal};