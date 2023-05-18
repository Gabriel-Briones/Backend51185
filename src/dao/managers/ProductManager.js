//importamos FS
import fs from "fs"
import __dirname from "../../utils.js";
import path from "path"

const filePath = path.join(__dirname, "../files/productos.json")

export default class ProductManager {
    constructor() {
        this.productos = []
        this.path = filePath
    }

    validarProducto = async (code) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8")
            const productos = JSON.parse(data);

            if (productos.some(producto => producto.code == code)) {
                return true
            } else {
                return false
            }
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category) => {
        if (fs.existsSync(this.path)) {
            let validacion = await this.validarProducto(code);

            if (validacion) {
                return null;
            } else {

                if (!title || !description || !price || !code || !stock) {
                    return null
                }

                const data = await fs.promises.readFile(this.path, "utf-8")
                const productos = JSON.parse(data);

                const producto = {
                    title: title,
                    description: description,
                    price: price,
                    thumbnail,
                    status: true,
                    category: category,
                    code: code,
                    stock: stock,
                    id: productos.length + 1,
                };

                productos.push(producto);

                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));

                return "el producto se añadió correctamente";

            }

        } else {// creamos el primer producto del JSON
            if (!title || !description || !price || !code || !stock) {
                return null;
            }
            const producto = {
                title: title,
                description: description,
                price: price,
                thumbnail,
                status: true,
                category: category,
                code: code,
                stock: stock,
                id: this.productos.length + 1,
            };

            this.productos.push(producto);
            await fs.promises.writeFile(this.path, JSON.stringify(this.productos, null, "\t"));
            return "el producto se añadió correctamente";
        }
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productos = JSON.parse(data);
            return productos
        } else {
            return [];
        }
    }

    getProductById = async (idProducto) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productos = JSON.parse(data);

            const producto = productos.find(producto => producto.id == idProducto)
            if (producto) {
                return producto
            } else {
                return null
            }
        }
    }

    //Borramos un producto por ID
    deleteProductById = async (idProducto) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productos = JSON.parse(data);
            const producto = productos.find(producto => producto.id == idProducto)
            if (producto) {
                const indice = productos.indexOf(producto);
                productos.splice(indice, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
                return "El producto se elimino correctamente"
            } else {
                return null
            }
        }
    }

    //modificamos un producto por ID
    updateProduct = async (idProducto, modificacion) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productos = JSON.parse(data);
            let producto = productos.find(producto => producto.id == idProducto)
            let keysProducto = Object.keys(modificacion);

            if (!producto) {
                return null
            }

            for (const key of keysProducto) {
                if (producto.hasOwnProperty(key)) {
                    producto[key] = modificacion[key]
                }
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
            return "El producto se actualizo correctamente"
        }
    }
}

