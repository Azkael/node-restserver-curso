//=============================
// PUERTO
//=============================
process.env.PORT = process.env.PORT || 3000;

//=============================
// ENTORNO
//=============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============================
// Exp Token
//=============================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '1h';

//=============================
// SEED AUTH
//=============================
process.env.SEED = process.env.SEED || 'SEED_DEV'

//=============================
// BASE DE DATOS
//=============================

let urlDB;
if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe'
else
    urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;