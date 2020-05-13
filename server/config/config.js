//===================
// Puerto
//===================
process.env.PORT = process.env.PORT || 3000;


//===================
// Entorno
//===================
process.env.NODE_ENV = process.env.NODE_END || 'dev';


//===================
// Base de datos
//===================
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/test'
} else {
    urlDB = 'mongodb+srv://marivaldr:ePM4pEegOIJCHHZA@cluster0-ewv3i.mongodb.net/cafe';
}

process.env.URLDB = urlDB;