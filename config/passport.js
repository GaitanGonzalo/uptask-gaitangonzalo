const passport = require('passport');
const LocalStrategy = require('passport-local');

const Usuarios = require('../models/Usuarios');
//estrategia local - logueo con credenciales propias

passport.use(
    new LocalStrategy(
        //por default passport espera un user y un password
        {
            usernameField: 'email',
            passwordField : 'password'
        },
        async (email, password, done)=> {
            try {
                const usuario =  await Usuarios.findOne({
                    where: {
                        email,
                        activo : 1
                    }
                });

                // console.log('ejeutando LocalStrategy buscando user en la db');
                // console.log(usuario);
                
                //usuario existe pero password no coincide
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message : 'El password es incorrecto'
                    })
                }
                //email correcto y pass correcto
                return done(null, usuario);

            } catch (error) {
                //ese usuario no existe
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
);
//serializar usuario
passport.serializeUser((usuario, callback)=> {
    callback(null, usuario);
});
// deserealizar el usuario
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});

module.exports = passport;