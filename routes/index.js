const express = require('express');

//importar el express-validators
const { body } = require('express-validator');
const proyectosController = require('../controllers/proyectosController');

const router = express.Router()

/**
 * LAS VALIDACIONES SE REALIZAN AQUI EN EL ROUTER, ANTES DEL CONTROLADOR
 */

module.exports = ()=>{

    router.get('/', proyectosController.proyectoshome);
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
   
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(), proyectosController.proyectoCrear);

    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

    return router;
}



