import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs'

const livro = db.Livro

describe('Agrupando testes dos livros', () =>{
    beforeEach(async () =>{
    await livro.destroy({where: {}, truncate: true})
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
        const res = await request(app).post('/livros').send(novoLivro);
        expect(res.status).toBe(201);
        expect(res.body.Livro).toHaveProperty('titulo', 'Dom Casmurro');
    });

    it('Deve retornar erro 400 ao retornar livro sem titulo', async () => {
        const novoLivro = ({
            ano_lancamento: 1899,
            genero: 'Romance',
            status: 'Disponível'
        });
        const res = await request(app).post('/livros').send(novoLivro);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'nao foi possivel fazer o cadastro');
    });

    it('Deve retornar um livro pelo id', async () =>{
        const novoLivro = ({
            id: 1,
            titulo: "Senhor dos Aneis",
            ano_lancamento: 2000,
            genero: "Ação",
            status: "Alugado",
        });
        const res = await request(app).post('/livros').send(novoLivro);
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
});