import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import db from '../models/index.cjs'
import jwtConfig from '../config/jwt.js';

const livro = db.Livro;
const livroAutor = db.LivroAutor;
const emprestimo = db.Emprestimo;

const token = jwt.sign(
    { id: 1, email: 'teste@teste.com' },
    jwtConfig.secret,
    { expiresIn: jwtConfig.accessExpiresIn }
);

describe('Agrupando testes dos livros', () =>{
    beforeEach(async () =>{
        await livroAutor.destroy({ where: {} });
        await emprestimo.destroy({ where: {} });
        await livro.destroy({ where: {} });
    }); 
    
    it('Deve retornar a lista vazia de livros', async () =>{
      const res = await request(app).get('/livros')
      expect(res.status).toBe(200);
      expect(res.body).toEqual({"Livro": [], "message": "Livro listado com sucesso"});
    });

    it('Deve retornar uma mensagem quando livro é criado', async () =>{
        const novoLivro = ({
            titulo: 'Dom Casmurro',
            ano_lancamento: 1899,
            genero: 'Romance',
            status: 'Disponível'
        });
        const res = await request(app).post('/livros').send(novoLivro).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res.body.Livro).toHaveProperty('titulo', 'Dom Casmurro');
    });

    it('Deve retornar erro 400 ao retornar livro sem titulo', async () => {
        const novoLivro = ({
            ano_lancamento: 1899,
            genero: 'Romance',
            status: 'Disponível'
        });
        const res = await request(app).post('/livros').send(novoLivro).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'nao foi possivel fazer o cadastro');
    });

    it('Deve retornar um livro pelo id', async () =>{
        const novoLivro = ({
            titulo: "Senhor dos Aneis",
            ano_lancamento: 2000,
            genero: "Ação",
            status: "Alugado",
        });
        const res = await request(app).post('/livros').send(novoLivro).set('Authorization', `Bearer ${token}`);
        const id = res.body.Livro.id;
        
        const res2 = await request(app).get(`/livros/${id}`);
        expect(res.status).toBe(201);
        expect(res2.status).toBe(200);
        expect(res2.body.Livro).toHaveProperty('titulo','Senhor dos Aneis');
    });

    it('Deve retornar erro 404 quando buscar um livro que não existe', async() =>{
        const res = await request(app).get('/livros/999999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'livro nao encontrado')
    });

    it('Deve retornar um livro atualizado', async () =>{
        const novoLivro = await db.Livro.create({
            titulo:'Titulo antigo', ano_lancamento: 2000,
            genero: "Ação",
            status: "Alugado",})
        const res = await request(app).put(`/livros/${novoLivro.id}`).send({titulo: 'Novo titulo'}).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/livros/${novoLivro.id}`);
        expect(res2.status).toBe(200);
        expect(res2.body.Livro).toHaveProperty('titulo', 'Novo titulo');
    });
     
    it('Deve deletar um livro', async () =>{
        const novoLivro = await db.Livro.create({
            titulo:'Titulo antigo', ano_lancamento: 2000,
            genero: "Ação",
            status: "Alugado",});
        const res = await request(app).delete(`/livros/${novoLivro.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/livros/${novoLivro.id}`);
        expect(res2.status).toBe(404);
        expect(res2.body).toHaveProperty('message','livro nao encontrado');
    });

    it('Deve retornar 401 ao criar livro sem token e não gravar nada', async () =>{
        const res = await request(app).post('/livros').send({
            titulo: 'Sem Token',
            ano_lancamento: 2000,
            genero: 'Romance',
            status: 'Disponível'
        });
        expect(res.status).toBe(401);

        const lista = await request(app).get('/livros');
        expect(lista.body.Livro).toEqual([]);
    });

    it('Deve retornar 401 ao atualizar livro sem token', async () =>{
        const res = await request(app).put('/livros/1').send({ titulo: 'Sem Token' });
        expect(res.status).toBe(401);
    });

    it('Deve retornar 401 ao deletar livro sem token', async () =>{
        const res = await request(app).delete('/livros/1');
        expect(res.status).toBe(401);
    });

    afterAll(async () => {
    await db.sequelize.close();
   });
});