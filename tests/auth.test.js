import  request  from 'supertest';
import {describe, it, expect, beforeEach, afterAll} from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs';
import pessoaService from '../services/pessoaService.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

describe('Autenticação', () =>{
    beforeEach (async () =>{
        await db.Pessoa.destroy({where:{}});
        await pessoaService.cadastrar({
            nome: 'Usuario Auth',
            cpf: '11111111111',
            telefone: '11111111111',
            email: 'auth@teste.com',
            senha: 'senha123'
        })
    })

    it('Deve fazer login com credenciais corretas', async () =>{
        const res = await request(app).post('/login').send({email: 'auth@teste.com', senha: 'senha123'});

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    it('Deve retornar 400 quando email e senha são null', async () =>{
        const res = await request(app).post('/login').send({email: null, senha: null});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'email e senha são obrigatórios');
    });

    it('Devem retonar erro 401 e a mesma mensagem se email ou senha forem incorretos', async () =>{
        const res = await request(app).post('/login').send({email:  'auth@teste.com', senha: 'senhaerrada' });
        const res2 = await request(app).post('/login').send({email:  'naoexiste@teste.com', senha: 'senha123' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Essa senha ou email nao existem');
        expect(res2.status).toBe(401);
        expect(res2.body).toHaveProperty('message',  'Essa senha ou email nao existem');
    });

    it('Deve retornar erro 401 sem o token fornecido', async () =>{
        const res = await request(app).get('/pessoas')
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'token nao fornecido');
    });

    it('Retorna 401 com um token invalido ou expirado', async () =>{
        const res = await request(app).get('/pessoas').set('Authorization', 'Bearer tokeninvalido');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Token invalido ou expirado');
    });

    it('Deve retornar erro 401 com token expirado', async () =>{
        const tokenExpirado = jwt.sign({
            id: 1,
            email: 'belle@teste.com',
        }, jwtConfig.secret,{
            expiresIn: '-1000'
        });

        const res = await request(app).get('/pessoas').set('Authorization', `Bearer ${tokenExpirado}`);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Token invalido ou expirado');
    });

    afterAll(async() =>{
        await db.sequelize.close();
    })
})