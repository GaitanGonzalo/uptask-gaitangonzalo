//const { noExtendLeft } = require('sequelize/types/lib/operators');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');



exports.proyectoshome = async (req, res)=>{
    //send nos imprime el texto que enviamos
    //resp.send('Index');
    const usuarioId = res.locals.usuario.id;
    console.log(res.locals.usuario);
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    //render nos imprime la vista
    res.render('index', {
        nombrePag : 'Proyectos',
        proyectos
    });
    
}
exports.formularioProyecto = async (req, res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('nuevoProyecto', {
        nombrePag: 'Nuevo Proyecto',
        proyectos
    });
}

exports.proyectoCrear = async (req, res)=>{
    const usuarioId = res.locals.usuario.id;
    await Proyectos.findAll({where: {usuarioId}});
    // res.send('Enviaste el Formulario');
    //console.log(req.body);
    const nombre = req.body.nombre

    let error = [];
    if(!nombre){
        error.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    if(error.length > 0){
        res.render('nuevoProyecto', {
            nombrePag: 'Nuevo Poryecto',
            error,
            proyectos
        });
    }else{
        //en caso de que no haya errores insertamos en la base de datos
        // proyectos.create({nombre})
        // .then(()=>{console.log('Registro agregado correctamente')})
        // .catch(err => console.log('Error al Registrar'))

        //utilizando async - await // en la definicion de export agregar el async

        //agregando slug para transformar textos para la url
        // const url = slug(nombre).toLowerCase();

        //hooks
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
       
    }
}

exports.proyectoPorUrl = async (req, res)=>{

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    const proyecto = await Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });

    // consultar las tareas del proyecto
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        },
        // include: [ //una forma de traer el modelo relacionado al estilo dde un JOIN
        //     {model: Proyectos}
        // ]
    });

    if(!proyecto) return next()

    //render a la vista

    res.render('tareas', {
        nombrePag: 'Tareas del Proyecto',
        proyectos,
        proyecto,
        tareas
    })
}

exports.formularioEditar = async (req, res)=>{

    const usuarioId = res.locals.usuario.id;
    const proyectosProm = Proyectos.findAll({where: {usuarioId}});
    const proyectoProm = Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosProm, proyectoProm]);
    //render a la vista nuevo proyecto y la vamos a reutilizar
    res.render('nuevoProyecto', {
        nombrePag : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarPoryecto = async (req, res)=>{
    const usuarioId = res.locals.usuario.id;
    await Proyectos.findAll({where:{usuarioId}});
    //res.send('Enviaste el Formulario');
    //console.log(req.body);
    const nombre = req.body.nombre

    let error = [];
    if(!nombre){
        error.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    if(error.length > 0){
        res.render('nuevoProyecto', {
            nombrePag: 'Nuevo Poryecto',
            error,
            proyectos
        });
    }else{
        //en caso de que no haya errores insertamos en la base de datos
        // proyectos.create({nombre})
        // .then(()=>{console.log('Registro agregado correctamente')})
        // .catch(err => console.log('Error al Registrar'))

        //utilizando async - await // en la definicion de export agregar el async

        //agregando slug para transformar textos para la url
        // const url = slug(nombre).toLowerCase();

        //hooks
        
        await Proyectos.update(
                {nombre: nombre},
                {where: {
                    id: req.params.id
                }});
        res.redirect('/');
    }
}

exports.deleteProyecto = async (req, res, next)=>{

    //req, query o params para leer los datos
    //console.log(req);

    const {urlProyecto} = req.query;

   const result =  await Proyectos.destroy({where:{url: urlProyecto}});
    //si hubo un error en instruccion paso al siguiente medleware que es next y en el front hacer el catch del error
    if(!result){
        return next();
    }
    res.send('Proyecto elimiando Correctamente');
}
