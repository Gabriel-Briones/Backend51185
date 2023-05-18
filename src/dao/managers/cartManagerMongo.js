import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

export default class CartManager {
    createCart = async () => {
        try {
            const cart = await cartModel.create({})
            return ({
                code: 200,
                status: 'Success',
                message: cart
            })
        } catch (error) {
            return ({
                code: 400,
                status: 'Error',
                message: error
            })
        }
    }

    addProductInCart = async (cid, pid) => {
        const cart = await cartModel.findOne({ _id: cid });
        const producto = await productModel.findOne({ _id: pid })

        if (cart && producto) {
            const index = cart.productos.findIndex(product => product.producto == pid);
            if (index != -1) {
                let total = cart.productos[index].qty
                cart.productos[index].qty = total + 1;
            } else {
                cart.productos.push({ producto: pid, qty: 1 });
            }

            const result = await cartModel.updateOne({ _id: cid }, { $set: cart });

            return ({
                code: 200,
                status: 'success',
                message: cart.productos

            })
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'Hubo un error al agregar el producto'
            })
        }
    }

    deleteProductInCart = async (cid, pid) => {
        const cart = await cartModel.findOne({ _id: cid });

        const index = cart.productos.findIndex(producto => producto._id == pid);

        if (index != -1) {
            cart.productos.splice(index, 1);
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'No existe el producto'
            })
        }

        const result = await cartModel.updateOne({ _id: cid }, { $set: cart })
        return ({
            code: 200,
            status: 'Success',
            message: 'Producto eliminado correctamente'
        })
    }

    getCarts = async () => {
        const carts = await cartModel.find();

        return ({
            code: 200,
            status: 'Success',
            message: carts
        })
    }

    getCartById = async (cid) => {
        const cart = await cartModel.findOne({ _id: cid })
        console.log(JSON.stringify(cart, null, ('\t')))
        return ({
            code: 200,
            status: 'Success',
            message: cart
        })
    }

    deleteAllProductsInCart = async (cid) => {
        const cart = await cartModel.findOne({ _id: cid });

        cart.productos = [];

        const result = await cartModel.updateOne({ _id: cid }, { $set: cart })

        return ({
            code: 200,
            status: 'Success',
            message: result
        })
    }
} 