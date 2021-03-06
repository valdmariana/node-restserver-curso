//===================
// Puerto
//===================
process.env.PORT = process.env.PORT || 3000;


//===================
// Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===================
// Vencimiento del Token
//===================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '720h'

//=====================
// Seed de autenticacion
//======================
if (process.env.NODE_ENV === 'dev') {
    seed = 'este-es-el-seed-de-desarrollo';
} else {
    seed = process.env.SEED_PRODUCCION;
}

process.env.SEED = seed;

//===================
// Base de datos
//===================
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/test'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===================
// Google client id
//===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '513104297828-a2k42ungqk9jq8lfsvghtdhik90o60la.apps.googleusercontent.com';