const Sequelize = require('sequelize');
const db = require('../config/db');

//para relacionar dos tablas primeros agregamos Proyectos y despues el belonsTo(Proyectos)

const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    tarea: Sequelize.STRING,
    estado: Sequelize.INTEGER
});
//con esto relacionamos las tablas 1 tarea pertenece a 1 proyecto y me crea las FK
Tareas.belongsTo(Proyectos);

module.exports = Tareas;