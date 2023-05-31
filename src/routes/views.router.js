import { Router } from "express";
import ProductManager from "../dao/managers/ProductManagerMongo.js";
import CartManager from "../dao/managers/cartManagerMongo.js";
import productModel from "../dao/models/products.model.js";
import userModel from "../dao/models/User.model.js";
import { io } from "../app.js"

const productManager = new ProductManager();
const cartManager = new CartManager();
const router = Router();

//vuelve al perfil si ya está logueado
const publicAcces = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile');
    next();
}
//rol de administrador
const adminAcces = (req, res, next) => {
    console.log(req.session.user.rol);
    if (req.session.user.rol !== 'Admin') {
        console.log('Solo se admite al Administrador');
        return res.redirect('/');
    }
    next();
}

//Va al login si no está logueado
const privateAcces = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAcces, (req, res) => {
    res.render('register', {
        style: 'index.css',
    });
})

router.get('/login', publicAcces, (req, res) => {
    res.render('login', {
        style: 'index.css',
    });
})

router.get('/profile', privateAcces, (req, res) => {
    res.render('profile', {
        style: 'index.css',
        user: req.session.user
    })
}) // le pasamos los datos de la sesión de usuario

router.get('/users', privateAcces, adminAcces, async (req, res) => {
    const users = await userModel.find().lean();
    const user = req.session.user;

    res.render('users', {
        users, user
    })
})

router.get("/", privateAcces, async (req, res) => {
    res.render('home', {
        style: 'index.css',
        user: req.session.user,
        isAdmin: req.session.user.rol === 'Admin'
    });
})

router.get("/products", privateAcces, async (req, res) => {
    const { page = 1, limit = 4 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate({}, { page, limit, lean: true });
    const productos = docs;

    res.render('products', {
        style: 'index.css',
        productos,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        user: req.session.user,
        isAdmin: req.session.user.rol === 'Admin'
    });
})

router.get("/realtimeproducts", privateAcces, async (req, res) => {
    const productos = await productModel.find().lean();

    res.render('realTimeProducts', {
        style: 'index.css',
        productos
    });
})

router.get("/cart", privateAcces, async (req, res) => {
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

router.post("/realtimeproducts", privateAcces, async (req, res) => {
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

router.get('/cookie', (req, res) => {
    res.render('cookies', {
        style: 'index.css',
    });
})

router.post('/cookie', (req, res) => {
    const data = req.body;
    res.cookie('CoderCookie', data, { maxAge: 10000 }).send({ status: "success", message: "cookie set" })
})

router.get('/Session', (req, res) => {
    req.session.user = 'Active Session';
    res.send('Session Set');
});

router.get('/Session/test', (req, res) => {
    res.send(req.session.user);
})


export default router