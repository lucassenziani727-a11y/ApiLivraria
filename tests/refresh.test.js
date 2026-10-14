import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs';
import pessoaService from '../services/pessoaService.js';
import { gerarRefreshToken } from '../utils/refreshToken.js';

const dadosPessoa = {
    nome: 'Usuario Refresh',
    cpf: '11111111111',
    telefone: '11111111111',
    email: 'refresh@teste.com',
    senha: 'senha123'
};

describe('Refresh token e logout', () => {
    let pessoaCriada;
    let refreshToken;

    beforeEach(async () => {
        await db.RefreshToken.destroy({ where: {} });
        await db.Pessoa.destroy({ where: {} });

        pessoaCriada = await pessoaService.cadastrar(dadosPessoa);

        const res = await request(app).post('/login').send({ email: dadosPessoa.email, senha: dadosPessoa.senha });
        refreshToken = res.body.refreshToken;
    });

    describe('POST /refresh', () => {
        
        it('Deve devolver novos tokens quando o refresh token é válido', async () => {
            const res = await request(app).post('/refresh').send({ refreshToken });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
            expect(res.body.refreshToken).not.toBe(refreshToken);

            const rotaProtegida = await request(app).get('/pessoas').set('Authorization', `Bearer ${res.body.accessToken}`);
            expect(rotaProtegida.status).toBe(200);
        });

        it('Deve recusar o reuso de um refresh token já consumido', async () => {
            const primeira = await request(app).post('/refresh').send({ refreshToken });
            expect(primeira.status).toBe(200);

            const segunda = await request(app).post('/refresh').send({ refreshToken });
            expect(segunda.status).toBe(401);
            expect(segunda.body).toHaveProperty('message', 'Refresh token invalido ou expirado');
        });

        it('Deve retornar 400 quando o refreshToken não é enviado', async () => {
            const res = await request(app).post('/refresh').send({});

            expect(res.status).toBe(400);
        });

        it('Deve retornar 401 para um token que não existe', async () => {
            const res = await request(app).post('/refresh').send({ refreshToken: 'abc123' });

            expect(res.status).toBe(401);
        });

        it('Deve retornar 401 para um token expirado', async () => {
            const { token, tokenHash } = gerarRefreshToken();
            await db.RefreshToken.create({
                pessoaId: pessoaCriada.id,
                tokenHash,
                expiresAt: new Date(Date.now() - 1000)
            });

            const res = await request(app).post('/refresh').send({ refreshToken: token });

            expect(res.status).toBe(401);
        });
    });

    describe('POST /logout', () => {
        it('Deve revogar o token, e o refresh seguinte deve falhar', async () => {
            const logout = await request(app).post('/logout').send({ refreshToken });
            expect(logout.status).toBe(200);

            const refresh = await request(app).post('/refresh').send({ refreshToken });
            expect(refresh.status).toBe(401);
        });

        it('Deve continuar retornando 200 num logout repetido', async () => {
            await request(app).post('/logout').send({ refreshToken });
            const res = await request(app).post('/logout').send({ refreshToken });

            expect(res.status).toBe(200);
        });

        it('Deve retornar 400 quando o refreshToken não é enviado', async () => {
            const res = await request(app).post('/logout').send({});

            expect(res.status).toBe(400);
        });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});