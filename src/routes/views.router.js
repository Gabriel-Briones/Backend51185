import { Router } from "express";
import ProductManager from "../dao/managers/ProductManagerMongo.js";
import CartManager from "../dao/managers/cartManagerMongo.js";
import productModel from "../dao/models/products.model.js";
import { io } from "../app.js"

const productManager = new ProductManager();
const cartManager = new CartManager();
const router = Router();

router.get("/", async (req, res) => {

    res.render('home', {
        style: 'index.css',
    });
})

router.get("/products", async (req, res) => {
    const { page = 1, limit = 4 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate({}, { page, limit, lean: true });
    const productos = docs;

    res.render('products', {
        style: 'index.css',
        productos,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    });
})

router.get("/realtimeproducts", async (req, res) => {
    const productos = await productModel.find().lean();

    res.render('realTimeProducts', {
        style: 'index.css',
        productos
    });
})

router.get("/cart", async (req, res) => {
    const carts = await cartManager.getCarts();
    const carritos = carts.message;

    res.render("cart", {
        carritos,
        style: 'index.css'
    })
})

router.get("/cart/:cid", async (req, res) => {
    const id = req.params.cid;
    const carts = await cartManager.getCartById(id);
    const cart = carts.message;
    const productos = cart.productos

    res.render("cart", {
        productos,
        style: 'index.css'
    })
})

router.post("/realtimeproducts", async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body
    const producto = await productManager.addProduct(title, description, price, thumbnail, code, stock, category)
    producto ? res.send({ status: producto }) : res.status(400).send({ error: "Dato faltante o el producto ya existe" });
    const productos = await productManager.getProducts()
    io.emit("newproduct", productos);
})

router.delete("/realtimeproducts/:pid", async (req, res) => {
    let pid = req.params.pid
    const producto = await productManager.deleteProduct(pid)
    producto ? res.send({ status: producto }) : res.status(400).send({ error: "No existe el ID en los productos" })
    const productos = await productManager.getProducts()
    io.emit("productdelete", productos);
})



export default router