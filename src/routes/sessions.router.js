import { Router } from 'express';
import userModel from '../dao/models/User.model.js';
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();

// router.post('/register', async (req, res) => {
//     let { first_name, last_name, email, rol, age, password } = req.body;
//     const exist = await userModel.findOne({ email });

//     if ( (email === 'adminCoder@coder.com') && (password === 'adminCod3r123')) {
//         rol = 'Admin';
//     } else {
//         rol = 'User';
//     }

//     if (exist) {
//         return res.status(400).send({ status: "error", error: "El usuario ya existe" });
//     }
//     const user = {
//         first_name, last_name, email, rol, age, password: createHash(password)
//     };

//     const result = await userModel.create(user);
//     res.send({ status: "success", message: "Usuario registrado" });
// })

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: "succes", message: "User registered" });

})
router.get('/failregister', async (req, res) => {
    console.log('Fallo en el registro');
    res.send({ error: 'Error en el registro' })
})

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email })

//     if (!user) {
//         return res.status(400).send({ status: "error", error: "Datos incorrectos" })
//     }

//     const isValidPassword = validatePassword(password, user);
//     if (!isValidPassword) return res.status(400).send({ status: "error", error: "Datos incorrectos" })

//     req.session.user = {
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age,
//         rol: user.rol
//     }
//     res.send({ status: "success", payload: req.res.user, message: "Primer logueo!" })
// })

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {

    if (!req.user) return res.status(400).send({ status: "error", error: 'Invalid credentials' });

    req.session.user = {
        firs_name: req.user.firs_name,
        last_name: req.user.last_name,
        name: `${req.user.firs_name} ${req.user.last_name}`,
        age: req.user.age,
        rol: req.user.rol,
        email: req.user.email
    }

    res.send({ status: "success", payload: req.user, message: "Primer logueo!!" })
})

router.get('/faillogin', async (req, res) => {
    console.log('Fallo en el ingreso');
    res.send({ error: 'Error en el ingreso' })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "No se pudo cerrar la sesión" })
        res.redirect('/');
    })
})

router.post('/restartPassword', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send({ status: "error", error: "Datos incorrectos" })

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ status: "error", error: "Datos incorrectos" })

    const newHashedPassword = createHash(password);

    await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

    res.send({ status: "success", message: "Contraseña actualizada" })
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req,res)=>{

    req.session.user = req.user; //damos de alta la sesión
    res.redirect('/')

})

export default router;