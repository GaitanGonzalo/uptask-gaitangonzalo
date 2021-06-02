//import { express} from 'express';
//import { Routes } from './routes';
const express = require('express');
const routes = require('./routes');
//leer file system
const path = require('path');
//importa el bodyParcer
const bodyParser = require('body-parser');

//crear la conexion a la base de datos
const db = require('./config/db');
//importamos os helpers
const helpers = require('./helpers');

require('./models/Proyectos');
//authenticate solo se va a conectar al db
//sync va a sincronizar y crear as tablas !importante importar el modelo antes.

db.sync()
    .then(()=> console.log('Conectado al servidor'))
    .catch(err=> console.log(err))

const app = express();

//app.use(express.json());
//habiltar el Engine Template PUG 
app.set('view engine', 'pug');
//añadimos la carpetas de las vistas
app.set('views', path.join(__dirname, './views'));
//pasar var dump
//esta es un midleware
app.use((req, res, next)=>{

    res.locals.vardump = helpers.vardump;
    next();
})

//donde cargar los arhivos estaticos
app.use(express.static('public'));

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}))
//ruteo
//app.use('/', 'Hoal Mundo')
app.use('/', routes() );

app.listen(3000);