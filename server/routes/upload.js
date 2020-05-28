const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    let nombreArchivo = `${id}-${new Date().getTime()}.${extension}`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        writeImg(tipo, id, res, nombreArchivo)

    });

});

function writeImg(tipo, id, res, nombreArchivo) {

    let entity = tipo == 'usuarios' ? Usuario : Producto;
    let message = tipo == 'usuarios' ? 'Usuario no encontrado' : 'Producto no encontrado';
    entity.findByIdAndUpdate(id, { img: nombreArchivo }, (err, entityDB) => {
        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!entityDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message
                }
            });
        }

        borraArchivo(entityDB.img, tipo);

        if (tipo == 'usuarios') {

            res.json({
                ok: true,
                usuario: entityDB,
                img: nombreArchivo
            });
        } else {
            res.json({
                ok: true,
                producto: entityDB,
                img: nombreArchivo
            })
        }
    })
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;