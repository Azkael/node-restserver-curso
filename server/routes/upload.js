const express = require('express');
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded'
            }
        })
    }

    //validar tipos
    let tiposValidos = ['productos', 'usuarios']

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitios son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let ext = nombreArchivo[nombreArchivo.length - 1]

    //Extensiones permitidas
    const extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (!extensiones.includes(ext)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no valido'
            }
        })
    }

    //Cambiar nombre del archivo
    let nombreFinalArchivo = `${id}-${new Date().getMilliseconds()}.${ext}`

    archivo.mv(`uploads/${tipo}/${nombreFinalArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Modificando Usuario
        if (tipo === 'usuarios')
            imagenUsuario(id, res, nombreFinalArchivo);
        else
            imagenProducto(id, res, nombreFinalArchivo)
    })

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDb) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDb.img, 'usuarios');

        usuarioDb.img = nombreArchivo;

        usuarioDb.save((err, usuarioGuardado) => {
            console.log(err)
            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        })


    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDb) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        borraArchivo(productoDb.img, 'productos');
        
        productoDb.img = nombreArchivo;

        productoDb.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })


    })

}

function borraArchivo(imagen, tipo) {
    //Validando ruta de la imagen
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}
module.exports = app;