import { Router } from "express";
import CartManager from "../dao/managers/cartManagerMongo.js";


const cartManager = new CartManager()
const router = Router()

router.get("/", async (req,res) => {
    const cart = await cartManager.getCarts();
    res.status(cart.code).send({status: cart.status, message: cart.message});
})

router.post("/", async (req, res) => {
    const cart = await cartManager.createCart()
    res.status(cart.code).send({status: cart.status, message: cart.message})
})

router.get("/:cid", async (req,res) => {
    const id = req.params.cid
    const cart = await cartManager.getCartById(id);
    res.status(cart.code).send({status: cart.status, message: cart.message});
})

router.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const productCart = await cartManager.addProductInCart(cid,pid);
    res.status(productCart.code).send({status: productCart.status, message: productCart.message})
})

router.delete("/:cid/products/:pid", async (req,res) => {
    const cid = req.params.cid;
    const pid = req.params.pid

    const result = await cartManager.deleteProductInCart(cid,pid);

    res.status(result.code).send({status: result.status, message: result.message});
})

router.delete("/:cid", async (req,res) => {
    const id = req.params.cid;

    const result = await cartManager.deleteAllProductsInCart(id);

    res.status(result.code).send({status: result.status, message: result.message})
})


export default router