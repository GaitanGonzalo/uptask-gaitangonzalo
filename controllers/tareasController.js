const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.crearTareas = async (req, res, next)=>{
    //primero obtenemos el proyecto actual

    const proyecto = await Proyectos.findOne({where:{
        url: req.params.url
    }});

    //leer el calor del input
    const {tarea} = req.body;
    const estado = 0;
    const proyectoId = proyecto.id

    //inserat en la base de datos y rediraccionar
    const result = await Tareas.create({tarea, estado, proyectoId});
    if(!result){
        return next();
    }
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarTareas = async (req, res, next)=>{
    console.log(req.params);

    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where:{id}
    })
    //cambiar estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1
    }
    tarea.estado = estado;

    //guardo la respuesta
    const resultado = await tarea.save();
    if(!resultado) return next()
    console.log(tarea);
    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req,res, next) => {
    console.log(req.params);
    const {id} = req.params;

    //Eliminamos la tarea
    const result = await Tareas.destroy({where: {id}});
    if(!result) return next();

    res.status(200).send('Eliminando....');
}