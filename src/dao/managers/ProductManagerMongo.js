import productModel from "../models/products.model.js";

// const products = [
//     {
//         "title": "NVIDIA GeForce RTX 3070",
//         "description": "Tarjeta gráfica para juegos",
//         "price": 899,
//         "thumbnail": "imagen_nvidia_geforce_rtx_3070.png",
//         "code": "NVG3070",
//         "stock": 15,
//         "status": true,
//         "category": "Placas de video",
//     },
//     {
//         "title": "AMD Ryzen 7 5800X",
//         "description": "Procesador de alto rendimiento para PC",
//         "price": 439,
//         "thumbnail": "imagen_amd_ryzen_7_5800x.png",
//         "code": "AMDR7580X",
//         "stock": 12,
//         "status": true,
//         "category": "Procesadores",
//     },
//     {
//         "title": "Kingston HyperX Fury DDR4 16GB",
//         "description": "Módulo de memoria RAM DDR4 para PC",
//         "price": 89,
//         "thumbnail": "imagen_kingston_hyperx_fury_ddr4_16gb.png",
//         "code": "KSHFDDR416GB",
//         "stock": 20,
//         "status": true,
//         "category": "Memorias",
//     },
//     {
//         "title": "Western Digital Black SN750 1TB",
//         "description": "Disco duro sólido (SSD) de alto rendimiento para PC",
//         "price": 179,
//         "thumbnail": "imagen_wd_black_sn750_1tb.png",
//         "code": "WDBSN7501TB",
//         "stock": 18,
//         "status": true,
//         "category": "Almacenamiento",
//     },
//     {
//         "title": "ASUS ROG Maximus XIII Hero",
//         "description": "Tarjeta madre para PC gaming de alto rendimiento",
//         "price": 599,
//         "thumbnail": "imagen_asus_rog_maximus_xiii_hero.png",
//         "code": "ASUSROGMXIIIHERO",
//         "stock": 8,
//         "status": true,
//         "category": "Mothers",
//     },
//     {
//         "title": "AMD Radeon RX 6900 XT",
//         "description": "Tarjeta gráfica de alta gama para PC gaming",
//         "price": 1499,
//         "thumbnail": "imagen_amd_radeon_rx_6900_xt.png",
//         "code": "AMDRX6900XT",
//         "stock": 10,
//         "status": true,
//         "category": "Placas de video",
//     },
//     {
//         "title": "Intel Core i7-11700K",
//         "description": "Procesador de alta gama para PC",
//         "price": 449,
//         "thumbnail": "imagen_intel_core_i7_11700k.png",
//         "code": "INTEL11700K",
//         "stock": 14,
//         "status": true,
//         "category": "Procesadores",
//     },
//     {
//         "title": "Corsair Vengeance LPX DDR4 8GB",
//         "description": "Módulo de memoria RAM DDR4 de bajo perfil para PC",
//         "price": 59,
//         "thumbnail": "imagen_corsair_vengeance_lpx_ddr4_8gb.png",
//         "code": "CORSAIRVENLPXDDR48GB",
//         "stock": 25,
//         "status": true,
//         "category": "Memorias",
//     },
//     {
//         "title": "Crucial MX500 500GB",
//         "description": "Disco duro sólido (SSD) de alta capacidad para PC",
//         "price": 99,
//         "thumbnail": "imagen_crucial_mx500_500gb.png",
//         "code": "CRUCIALMX500500GB",
//         "stock": 22,
//         "status": true,
//         "category": "Almacenamiento",
//     },
//     {
//         "title": "Gigabyte AORUS X570 Master",
//         "description": "Tarjeta madre para PC gaming de alto rendimiento",
//         "price": 439,
//         "thumbnail": "imagen_gigabyte_aorus_x570_master.png",
//         "code": "GIGAX570MASTER",
//         "stock": 9,
//         "status": true,
//         "category": "Mothers",
//     }
// ]

export default class ProductManager {

    insertManyProducts = async () => {
        const result = await productModel.insertMany(products);
        return ({
            code: 200,
            status: 'Success',
            message: result
        })
    }

    getProducts = async (limit, page) => {
        const products = await productModel.paginate({}, { limit, page, lean: true })
        return ({
            code: 200,
            status: 'Success',
            message: products
        })
    }

    getProductById = async (pid) => {
        const product = await productModel.findOne({ _id: pid })
        if (product) {
            return ({
                code: 200,
                status: 'Success',
                message: product
            })
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'El id no existe'
            })
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category) => {
        const defaultThumbnail = "default.jpg"; // Valor por defecto para thumbnail
        thumbnail = thumbnail ? thumbnail : defaultThumbnail 

        const producto = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            status: true,
            code: code,
            stock: stock,
            category: category
        }
        console.log("desde addProduct en manager mongo",producto)  
        

        if (!title || !description || !price || !code || !stock || !category) {
            return ({
                code: 400,
                status: 'Error',
                message: 'Datos faltantes'
            })
        }

        const result = productModel.create(producto)

        return ({
            code: 200,
            status: 'Success',
            message: result
        })
    }

    updateProduct = async (pid, actualizacion) => {
        const producto = await productModel.updateOne({ _id: pid }, { $set: actualizacion });
        if (producto) {
            return ({
                code: 200,
                status: 'Success',
                message: producto
            })
        } else {
            return ({
                code: 400,
                status: 'Success',
                message: 'No existe un producto con ese ID'
            })
        }
    }

    deleteProduct = async (pid) => {
        const producto = await productModel.deleteOne({ _id: pid })
        if (producto) {
            return ({
                code: 200,
                status: 'Success',
                message: producto
            })
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'No existe un producto con ese ID'
            })
        }
    }
}