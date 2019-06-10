const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const ObjectId = require('mongoose').Types.ObjectId;

const verificaId = (id) => {
    return ObjectId.isValid(id);
}

//Obtener todos los productos

app.get('/productos', verificaToken, (req, res) => {
    //todos los productos
    //cargar usario y categoria | populate
    //paginado
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let termino = req.body.termino;


    desde = Number(desde);
    limite = Number(limite);
    let filtro = {disponible: true}

    if(termino && !_.isEmpty(termino)){
        let nombre = new RegExp(termino, 'i');
        filtro = {
            ...filtro,
            nombre
        }
    }

    Producto.find(filtro)
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments(filtro, (err, cantidad) => {
                res.json({
                    ok: true,
                    cantidad,
                    producto: productoDb
                })
            })
        })
})


//Producto por id
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!productoDb) {
                return res.status(500).json({
                    ok: false,
                    message: 'Producto no encontrado'
                })
            }

            res.json({
                ok: true,
                producto: productoDb
            })

        })
})

//Crear Producto
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = _.pick(req.body, [
        'nombre',
        'precioUni',
        'descripcion',
        'disponible',
        'categoria'
    ]);

    let producto = new Producto({
        ...body,
        usuario: req.usuario._id
    })

    if (verificaId(body.categoria) === false) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Categoria no valida'
            }
        })
    }

    Categoria.findById(body.categoia, (err, categoriaDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            })
        }

    })

    producto.save((err, productoDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDb
        })
    })
})


//Actualizar Producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        'nombre',
        'precioUni',
        'descripcion',
        'categoria'
    ]);

    if (body.categoria) {
        if (verificaId(body.categoria) === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no valida'
                }
            })
        }

        Categoria.findById(body.categoia, (err, categoriaDb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La categoria no existe'
                    }
                })
            }

        })
    }

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: false,
            producto: productoDb
        })

    })


})

//Borrar Producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    //pasarlo a disponible: false
    let id = req.params.id;

    let cambio = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambio, {
        new: true
    }, (err, productoDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                err: 'El producto no existe'
            })
        }

        res.json({
            ok: true,
            message: 'Producto eliminado'
        })

    })
})

module.exports = app;