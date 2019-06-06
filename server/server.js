require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

app.use( require('./routes/usuario'));

mongoose.connect(process.env.URLDB, {
    useCreateIndex: true,
    useNewUrlParser: true
}, (err) => {
    if(err) console.log('No se pudo conectar a la base de datos!!!')
    else console.log('Base de datos ONLINE!!')
});

app.listen(process.env.PORT, () => console.log(`Escuchando puerto ${process.env.PORT}`));