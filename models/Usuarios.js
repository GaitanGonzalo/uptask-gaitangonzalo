const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Proyectos = require('../models/Proyectos');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email : {
        type: Sequelize.STRING(150),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'Este campo no puede estar vacio'
            },
            isEmail:{
                msg: 'Agrega un correo Válido'
            }
        },
        unique:{
                args: true,
                msg: 'Usuario ya Registrado'
            }
    },
    token: Sequelize.STRING,
    expiracion:Sequelize.DATE,
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'El password no puede ir Vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue : 0
    },
},
{
    hooks:{
       beforeCreate(usuario){
           usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
       } 
    }
})
//metodos personalizados

Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios
