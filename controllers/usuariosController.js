const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handler/email');

exports.formCrearCuenta = (req, res)=>{
    res.render('crearCuenta', {
        nombrePag : 'Crear Cuenta en UpTask'
    })
}
exports.formIniciarSesion = (req, res)=>{
    const {error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePag : 'Iniciando Sesion en UpTask',
        error
    })
}
exports.crearCuenta = async (req, res)=> {
    // res.send('Enviaste el Form');
    //recueprar los datos
    //console.log(req.body);
    const {email, password} = req.body;
    //crear el usuario
    try {
        
      await  Usuarios.create({
            email,
            password
        });
        //crear una url de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //crear el objeto de usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Uptask',
            confirmarUrl,
            archivo : 'confirmar-cuenta'
        });
        //redirigir
        req.flash('correcto', 'Enviamos un correo, Conrima tu cuenta');
        res.redirect('/iniciar-sesion');
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePag : 'Crear Cuenta en UpTask',
            email,
            password 
        })
    }
}

exports.formReestablecerPass = (req, res)=>{

    res.render('reestablecer', {
        nombrePag : 'Reestablecer Contraseña'
    })
}


//cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res)=>{
    //res.json(req.params.correo);
    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });

    if(!usuario){
        req.flash('error', 'No Válido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}