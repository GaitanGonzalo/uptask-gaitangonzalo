const express = require('express');

//importar el express-validators
const { body } = require('express-validator');
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

const router = express.Router()

/**
 * LAS VALIDACIONES SE REALIZAN AQUI EN EL ROUTER, ANTES DEL CONTROLADOR
 */

module.exports = ()=>{

    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectoshome);
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto);
   
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.proyectoCrear);

        // Listar el proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl);
    //show
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,    
        proyectosController.formularioEditar);
    //actualizar
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarPoryecto);
        //eliminar proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,    
        proyectosController.deleteProyecto);
    

    //AGREGAR TAREAS
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.crearTareas);

    //Actualizar tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarTareas);

    //Eliminar Trarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);

    //crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    //confirmar cuenta
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar  sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPass);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword)

    


    return router;
}



