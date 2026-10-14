import {compare, hash} from 'bcryptjs';
import db from '../models/index.cjs';
import  jwt  from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { gerarRefreshToken,  hashToken } from '../utils/refreshToken.js'

function gerarAccessToken(pessoa) {
    return jwt.sign({
        id: pessoa.id,
        email: pessoa.email,
    }, jwtConfig.secret, {
        expiresIn: '15m'
    });
}

async function cadastrar(dto) {
    let hashSenha = undefined

    if (dto.senha !== undefined) {
        hashSenha = await hash(dto.senha, 10);
    }

    const novaPessoa = await db.Pessoa.create({ ...dto, senha: hashSenha });

    return novaPessoa;
}

async function login(dto) {
    const pessoa = await db.Pessoa.scope('comSenha').findOne({ where: { email: dto.email } });
    if (pessoa === null) {
        throw new Error('Essa senha ou email nao existem')
    }

    const senhaValida = await compare(dto.senha, pessoa.senha);

    if (senhaValida === false) {
        throw new Error('Essa senha ou email nao existem')
    }

    const accessToken = gerarAccessToken(pessoa);

    const { token, tokenHash, expiresAt } = gerarRefreshToken();

    await db.RefreshToken.create({ pessoaId: pessoa.id, tokenHash, expiresAt })

    return { accessToken, refreshToken: token }
}

async function refresh(tokenRecebido) {
    const tokenHash = hashToken(tokenRecebido);

    const registro = await db.RefreshToken.findOne({ where: { tokenHash } });

    if (
        registro === null ||
        registro.revokedAt !== null ||
        registro.expiresAt.getTime() < Date.now()
    ) {
        throw new Error('Refresh token invalido ou expirado');
    }

    const pessoa = await db.Pessoa.findByPk(registro.pessoaId);

    if (pessoa === null) {
        throw new Error('Refresh token invalido ou expirado');
    }

    const { token, tokenHash: novoHash, expiresAt } = gerarRefreshToken();

    await db.sequelize.transaction(async (t) => {
        await registro.update({ revokedAt: new Date() }, { transaction: t });
        await db.RefreshToken.create(
            { pessoaId: pessoa.id, tokenHash: novoHash, expiresAt },
            { transaction: t }
        );
    });

    return { accessToken: gerarAccessToken(pessoa), refreshToken: token };
}

async function atualizar(id, dto) {
    const dadosParaAtualizar = { ...dto };

    if (dto.senha !== undefined) {
        dadosParaAtualizar.senha = await hash(dto.senha, 10);
    }

    const resultado = await db.Pessoa.update(dadosParaAtualizar, { where: { id: id } })

    return resultado
}

async function logout(tokenRecebido) {
    const tokenHash = hashToken(tokenRecebido);

    await db.RefreshToken.update(
        { revokedAt: new Date() },
        { where: { tokenHash, revokedAt: null } }
    );
}

export default {cadastrar,login, refresh, logout, atualizar}