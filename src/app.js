import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import { Server } from "socket.io";

import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from './routes/sessions.router.js';

const DB = 'test';
const MONGO = "mongodb+srv://gamiz08:90nB4FcgBlMjq56u@cluster0.69u12vz.mongodb.net/" + DB;

const app = express();

const enviroment = async () => {
    await mongoose.connect(MONGO);
}

enviroment();

app.use(express.json()); // para recibir correctamente el req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: 'SecretCode',
    resave: false,
    saveUninitialized: false
}));

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter)
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter)
app.use('/api/session', sessionRouter);

const PORT = 8080;
const server = app.listen(PORT, () => { console.log(`Servidor escuchando en el puerto: ${PORT}`) })

export const io = new Server(server);

io.on("connection", socket => {
    console.log("socket en uso - usuario conectado");
})

