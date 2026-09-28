import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt.js'

function authMiddleWare(req,res,next){
    const authHeader = req.headers.authorization

    if(authHeader === undefined){
       return res.status(401).json({message: 'token nao fornecido'})
    }

    const token = authHeader.split(' ')[1]

    try{
        const payload = jwt.verify(token, jwtConfig.secret)
        req.usuario = payload
        return next()
    }catch(erro){
        return res.status(401).json({message: 'Token invalido ou expirado'})
    }
}

export default authMiddleWare