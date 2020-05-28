const jwt = require('jsonwebtoken')

//=============================
// Verfificar Token
//=============================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decode.usuario;
        next();
    })
};

//=============================
// Verfificar AdminRole
//=============================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: "Solo los usuarios administradores pueden crear o modificar usuarios"
            }
        });
    }
    next();
};

//=============================
// Verfificar Token para imagen
//=============================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decode.usuario;
        next();
    })
};


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}