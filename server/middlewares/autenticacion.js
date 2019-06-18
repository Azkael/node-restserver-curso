const jwt = require('jsonwebtoken');

//VERIFICAR TOKEN

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token,process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: "Invalid Token"
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
}

//verificar admin role
let verifcaAdmin = (req,res, next) => {
    let role = req.usuario.role;
    
    if(role === "USER_ROLE"){
        return res.status(401).json({
            ok: false,
            err: {
                message: "El usario no es administrador"
            }
        })
    }
    next();
}

//verificar token img
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token,process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: "Invalid Token"
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

}

module.exports = {
    verificaToken,
    verifcaAdmin,
    verificaTokenImg
}
