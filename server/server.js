require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

app.get('/usuario', function (req, res) {
    res.json('get usuario')
});

app.post('/usuario', (rep, res) => {
    let body = rep.body;
    if(body.nombre)
        res.json(body);
    else{
        res.status(400).json({
            ok: false,
            message: "El nombre es necesario"
        })
    }
});

app.put('/usuario/:id', (rep, res) => {
    let id = rep.params.id;
    res.json({
        id
    })
});

app.listen(process.env.PORT, () => console.log(`Escuchando puerto ${process.env.PORT}`));