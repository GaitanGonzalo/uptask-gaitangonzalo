const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handler/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true
});

exports.usuarioAutenticado = (req, res, next)=>{

    // si el usuario esta autenticado seguir, si no volver al formulario
    if(req.isAuthenticated()){
        return next();
    }
    //sino
    res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
}

exports.enviarToken = async (req, res)=>{

    //verificar que el usuario existe - import Usuarios
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});
    //sino existe
    if(!usuario){
        req.flash('error', 'La cuenta no existe');
        res.redirect('/reestablecer');
    }
    //si el usuario existe generamos el token y la exipiracion
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    //guardar los datos
    await usuario.save();

    //url reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //enviar el correo con el token

    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });

    //terminar accion
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');


}

exports.validarToken = async (req, res)=>{

    //res.json(req.params.token);

    const usuario = await Usuarios.findOne({
        where:{
            token : req.params.token
        }
    });

    // console.log(usuario)
    // //sino encuentra el usuario
    if(!usuario){
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar la nueva password
    res.render('resetPassword', {
        nombePag: 'Reestablecer Contraseña'
    })

}
    //cambiar el pasword por uno nuevo
exports.actualizarPassword = async (req, res)=>{
    console.log(req.params.token)

    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    //verificamos si existe y si el token es valido
    if(!usuario){
        req.flash('error', 'No Válido');
        res.redirec('/reestablecer');
    }

    //si existe hasheamos el pass, guardamos y redireccionamos
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    
    await usuario.save()

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

    console.log(usuario);

}