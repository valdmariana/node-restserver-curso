const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    totalRegistros: conteo
                });
            });

        });
});


app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })
});

app.post('/categoria/', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    body.usuario = req.usuario._id;
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        let idCategoria = categoriaBorrada._id;
        Producto.updateMany({ "categoria": idCategoria }, { "$set": { "categoria": null } }, (err, respuesta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaBorrada,
            });
        });

    });

});

module.exports = app;