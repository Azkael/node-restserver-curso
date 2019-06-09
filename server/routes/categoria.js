const express = require('express');
const {verificaToken, verifcaAdmin} = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');
const _ = require('underscore');

const app =  express();

//Todas las categorias
app.get('/categoria',verificaToken, (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err, categorias) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        Categoria.countDocuments((err, cantidad) => {
            res.json({
                ok: true,
                cantidad,
                categorias
            })
        })
    });
});

//Solo una categorias
app.get('/categoria/:id',verificaToken, (req, res) => {
    //Categoria.findById()
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDb){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'Categoria no encontrada'
                }
            }) 
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        })

    });
});

//Crear categoria
app.post('/categoria', verificaToken, (req,res) => {
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDb){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            cagegoria: categoriaDb
        })
    })
})

//Modificar categoria
app.put('/categoria/:id', verificaToken, (req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body, 'descripcion');

    Categoria.findByIdAndUpdate(id, body,{
        new: true,
        runValidators: true
    }, (err, categoriaDb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDb){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        })

    })
})

//Borrar categoria
app.delete('/categoria/:id', verificaToken, verifcaAdmin, (req,res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDb){
            return res.status(400).json({
                ok: false,
                err: 'El id no existe'
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })
})

module.exports = app;