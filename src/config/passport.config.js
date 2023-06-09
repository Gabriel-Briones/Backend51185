import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/models/User.model.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import CartManager from "../dao/managers/cartManagerMongo.js";

const LocalStrategy = local.Strategy;
const cartManager = new CartManager()

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            let { first_name, last_name, email, rol, age } = req.body;
            try {
                const user = await userService.findOne({ email: username });
                const cart = await cartManager.createCart();
                console.log(cart); 
                if (user) {
                    console.log('El usuario existe');
                    return done(null, false);
                }
                if ((email === 'adminCoder@coder.com') && (password === 'adminCod3r123')) {
                    rol = 'Admin';
                } else {
                    rol = 'User';
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    rol,
                    age,
                    password: createHash(password),
                    cart: cart.message._id
                }
                console.log(newUser);

                

                const result = await userService.create(newUser);
                return done(null, result);

            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userService.findById(id);
        done(null, user)
    });

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await userService.findOne({ email: username })
            //console.log(user);
            if (!user) {
                console.log('No existe el usuario');
                return done(null, false);
            }
            if (!validatePassword(password, user)) return done(null, false);
            return done(null, user);

        } catch (error) {
            return done("Error al intentar ingresar: " + error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.4fcbc0ae797df8bd',
        clientSecret: '412ef9eb177d4f7a1ab7dc1ccdff53b06331d03f',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'

    }, async (accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile); //vemos toda la info que viene del profile
            const email = profile.emails[0].value;
            let user = await userService.findOne({ email })
            if (!user) {
                const newUser = {
                    first_name: profile.displayName,
                    last_name: " ",
                    name: profile._json.name,
                    email,
                    age: 18,
                    password: '',
                    rol: profile._json.type
                }
                const result = await userService.create(newUser);
                done(null, result)
            } else {
                //ya existe
                done(null, user)
            }

        } catch (error) {
            return done(null, error)
        }
    }))

}

export default initializePassport;