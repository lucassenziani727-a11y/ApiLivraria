import {compare, hash} from 'bcryptjs';
import db from '../models/index.cjs';
import  jwt  from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

async function cadastrar(dto) {
    const hashSenha = await hash(dto.senha,10);

    const novaPessoa = await db.Pessoa.create({...dto, senha: hashSenha});

    return novaPessoa;
    
}

async function login(dto) {
    const pessoa= await db.Pessoa.scope('comSenha').findOne({where: {email: dto.email}});
    if(pessoa === null){
        throw new Error('Essa senha ou email nao existem')
    }

    const senhaValida = await compare(dto.senha, pessoa.senha);

    if(senhaValida === false){
        throw new Error('Essa senha ou email nao existem')
    }

    const acessToken = jwt.sign({
        id: pessoa.id,
        email: pessoa.email,
    },jwtConfig.secret,{
    expiresIn: 86400 
    })

    return acessToken
}

export default {cadastrar,login}