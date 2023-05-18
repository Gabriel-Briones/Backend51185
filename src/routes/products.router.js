import { Router } from "express";
import ProductManager from "../dao/managers/ProductManagerMongo.js";

const productManager = new ProductManager();
const router = Router()

router.get("/insertion", async (req, res) => {
    const result = await productManager.insertManyProducts()
    res.status(result.code).send({status: result.status, message: result.message})
})

router.get("/", async (req, res) => {
    let {limit = 4, page = 1} = req.query;
    const productos = await productManager.getProducts(limit,page)
    res.status(productos.code).send({status: productos.status, message: productos.message});    
})

router.get("/:pid", async (req, res) => {
    const id = req.params.pid
    const producto = await productManager.getProductById(id)
    res.status(producto.code).send({status: producto.status, message: producto.message})
    
})

router.post("/", async (req, res) => {
    const {title, description, price, code, stock, category} = req.body

    const result = await productManager.addProduct(title,description,price,code,stock,category);

    res.status(result.code).send({status:result.status, message: result.message})
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const actualizacion = req.body
    
    const result = await productManager.updateProduct(id, actualizacion);

    res.status(result.code).send({status: result.status, message: result.message});
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    
    const result = await productManager.deleteProduct(id);

    res.status(result.code).send({status: result.status, message: result.message});
})

export default router