import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs';

const livro = db.Livro;
const autor = db.Autor;
const livroAutor = db.LivroAutor;

describe('agrupando testes de livroAutor', () => {

    let novoLivro;
    let novoAutor;

     beforeEach(async () =>{
        await livroAutor.destroy({ where: {}, truncate: true });
        await autor.destroy({where:{},  truncate: true});
        await livro.destroy({where: {},  truncate: true});
        novoAutor = await db.Autor.create({nome: 'Bruce Wayne', data_nascimento: '1984-12-19'})
        novoLivro = await db.Livro.create({ titulo: 'Coringa', ano_lancamento: 2024, genero: 'Ficção', status: 'Disponível' });
     });

     it('deve criar uma associação entre livro e autor com sucesso', async () =>{
      const res = await request(app).post(`/livros/${novoLivro.id}/autores`).send({autorId: novoAutor.id});
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Associação criada com sucesso')
      const associacao = await livroAutor.findOne({where: {livroId: novoLivro.id, autorId: novoAutor.id}});
      expect(associacao).not.toBeNull();
     });

     it('deve retornar erro 404 caso livro nao for encontrado', async () =>{
      const res = await request(app).post(`/livros/9999/autores`).send({autorId: novoAutor.id});
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'esse livro ou autor nao existem')
     });

     it('deve retornar erro 404 caso autor nao for encontrado', async () =>{
      const res = await request(app).post(`/livros/${novoLivro.id}/autores`).send({autorId: 9999});
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'esse livro ou autor nao existem')
     });

     afterAll(async () =>{
      await db.sequelize.close()
     });
});
