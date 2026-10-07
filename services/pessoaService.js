import {compare, hash} from 'bcryptjs';
import db from '../models/index.cjs';
import  jwt  from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { where } from 'sequelize';
import { gerarRefreshToken } from '../utils/refreshToken.js'

async function cadastrar(dto) {
    let hashSenha = undefined

    if(dto.senha !== undefined){
        hashSenha = await hash(dto.senha, 10);
    }

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

    const accessToken = jwt.sign({
        id: pessoa.id,
        email: pessoa.email,
    },jwtConfig.secret,{
    expiresIn: '15m' 
    });

    const {token, tokenHash, expiresAt} = gerarRefreshToken();

   await db.RefreshToken.create({pessoaId: pessoa.id, tokenHash, expiresAt})

    return {accessToken, refreshToken: token}
}

async function atualizar(id, dto) {
    const dadosParaAtualizar = {...dto};

    if(dto.senha !== undefined){
        dadosParaAtualizar.senha = await hash(dto.senha,10);
    }

    const resultado = await db.Pessoa.update(dadosParaAtualizar, {where:{id: id}})

    return resultado
}

export default {cadastrar,login, atualizar}