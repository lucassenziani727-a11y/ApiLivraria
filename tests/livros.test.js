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
        })
        const res = await request(app).post('/livros').send(novoLivro);
        expect(res.status).toBe(201);
        expect(res.body.Livro).toHaveProperty('titulo', 'Dom Casmurro');
    });
});