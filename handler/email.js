
const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailconfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailconfig.host,
    port: emailconfig.port,
    
    auth:{
        user: emailconfig.user,
        pass: emailconfig.pass
    }
});
//generar Html
const generarHtml = (archivo, opciones = {})=>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones) =>{

    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let mailOptions = {
        from: '"Uptask" <no-repli@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subjet, // Subject line
        text, // plain text body
        html // html body
      };
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, mailOptions);
      
};


