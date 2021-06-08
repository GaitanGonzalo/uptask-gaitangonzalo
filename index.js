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
//flash messages
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//impotar variables de entorno
require('dotenv').config({path: 'variables.env'});




//importamos los Modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
//authenticate solo se va a conectar al db
//sync va a sincronizar y crear as tablas !importante importar el modelo antes.

db.sync()
    .then(()=> console.log('Conectado al servidor'))
    .catch(err=> console.log(err))

const app = express();
//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}))

//app.use(express.json());

//donde cargar los arhivos estaticos
app.use(express.static('public'));
//habiltar el Engine Template PUG 
app.set('view engine', 'pug');
//añadimos la carpetas de las vistas
app.set('views', path.join(__dirname, './views'));
//pasar mensajes flash
app.use(flash());
//sesiones, navegar entre paginas sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
//pasasr vardump a la aplicacion
app.use((req, res, next)=>{
    //console.log(req.user);
    res.locals.vardump = helpers.vardump;
    //implementamos elos mensajes flash para que esten incorporados en las request
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})


//ruteo
//app.use('/', 'Hoal Mundo')
app.use('/', routes() );

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, ()=> {
    console.log('el servicor esta funcionando ')
});
