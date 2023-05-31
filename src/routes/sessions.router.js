import { Router } from 'express';
import userModel from '../dao/models/User.model.js';

const router = Router();

router.post('/register', async (req, res) => {
    let { first_name, last_name, email, rol, age, password } = req.body;
    const exist = await userModel.findOne({ email });

    if ( (email === 'adminCoder@coder.com') && (password === 'adminCod3r123')) {
        rol = 'Admin';
    } else {
        rol = 'User';
    }

    if (exist) {
        return res.status(400).send({ status: "error", error: "El usuario ya existe" });
    }
    const user = {
        first_name, last_name, email, rol, age, password
    };

    const result = await userModel.create(user);
    res.send({ status: "success", message: "Usuario registrado" });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password })

    if (!user) {
        return res.status(400).send({ status: "error", error: "Datos incorrectos" })
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: user.rol
    }
    res.send({ status: "success", payload: req.res.user, message: "Primer logueo!" })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "No se pudo cerrar la sesión" })
        res.redirect('/');
    })
})

export default router;