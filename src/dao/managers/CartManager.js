import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import ProductManager from "./ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const filePath = path.join(__dirname, "../files/cart.json")

const products = new ProductManager();

export default class CartManager {
    constructor() {
        this.carts = []
        this.path = filePath
    }

    addCart = async (title) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data)

            let cart = {
                title: title,
                id: carts.length + 1,
                productos: []
            }

            carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))
            return "Se creo el carrito correctamente"
        } else {

            let cart = {
                title: title,
                id: this.carts.length + 1,
                productos: []
            }

            this.carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"))
            return "Se creo el carrito correctamente"
        }
    }

    getCartById = async (cid) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data)

            const cartFiltrado = carts.find(cart => cart.id == cid);

            if (cartFiltrado) {
                return cartFiltrado
            } else {
                return null
            }
        }
    }

    addProductInCart = async (cid, pid) => {

        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data)

            const cartFiltrado = carts.find(cart => cart.id == cid);
            const producto = await products.getProductById(pid);

            if (cartFiltrado && producto) {
                let productIndex = cartFiltrado.productos.findIndex(p => p.productID == pid)

                const id = producto.id;

                if (productIndex != -1) {
                    cartFiltrado.productos[productIndex].quantity++;
                } else {
                    cartFiltrado.productos.push({ productID: id, quantity: 1 });
                }

                fs.writeFileSync(this.path, JSON.stringify(carts, null, "\t"));
                return ({ status: "Se añadió el producto correctamente" })

            } else {
                return null
            }

        }
    }
}