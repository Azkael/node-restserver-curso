const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const {verificaToken, verifcaAdmin} = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    let filtro = {
        estado: true
    }

    Usuario.find(filtro, 'nombre email rol estado')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments(filtro, (err, cantidad) => {
                res.json({
                    ok: true,
                    cantidad,
                    usuarios
                })
            })

        })
});

app.post('/usuario', [verificaToken, verifcaAdmin],(rep, res) => {
    let body = rep.body;
    const {nombre, email, password, role} = body;
    let usuario = new Usuario({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    usuario.save( (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [verificaToken, verifcaAdmin],(rep, res) => {
    let id = rep.params.id;
    let body = _.pick(rep.body, ['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    } ,(err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.delete('/usuario/:id', [verificaToken, verifcaAdmin],(rep, res) => {
    let id = rep.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuario) => {
    let cambioEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id,cambioEstado, {
        new: false,
    }, (err, usuario) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario
        })

    })
});

module.exports = app;
