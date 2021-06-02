//const { noExtendLeft } = require('sequelize/types/lib/operators');
const Proyectos = require('../models/Proyectos');




exports.proyectoshome = async (req, res)=>{
    //send nos imprime el texto que enviamos
    //resp.send('Index');

    const proyectos = await Proyectos.findAll();
    //render nos imprime la vista
    res.render('index', {
        nombrePag : 'Proyectos',
        proyectos
    });
    
}
exports.formularioProyecto = async (req, res)=>{

    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePag: 'Nuevo Proyecto',
        proyectos
    });
}

exports.proyectoCrear = async (req, res)=>{
    const proyectos = await Proyectos.findAll();
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

        const proyecto = await proyectos.create({nombre});
        res.redirect('/');
       
    }
}

exports.proyectoPorUrl = async (req, res)=>{
    const proyectos = await Proyectos.findAll();
    const proyecto = await Proyectos.findOne({
        where:{
            url: req.params.url
        }
    });
    if(!proyecto) return next()

    //render a la vista

    res.render('tareas', {
        nombrePag: 'Tareas del Proyecto',
        proyectos,
        proyecto,
    })
}