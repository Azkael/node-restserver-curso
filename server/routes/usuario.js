const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

app.get('/usuario', function (req, res) {
    res.json('get usuario')
});

app.post('/usuario', (rep, res) => {
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

app.put('/usuario/:id', (rep, res) => {
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

app.delete('/usuario', (rep, res) => {
    res.json('delete usuario')
});

module.exports = app;
