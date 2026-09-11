import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs'

const autor = db.Autor

describe('Agrupando testes dos autores', () =>{
    beforeEach(async () =>{
    await autor.destroy({where: {}, truncate: true})
    }); 
    
    it('Deve retornar a lista vazia de autores', async () =>{
      const res = await request(app).get('/autores')
      expect(res.status).toBe(200);
      expect(res.body).toEqual({"Autor": [], "message": "Autor listado com sucesso"});
    });

    it('Deve retornar uma mensagem quando autor é criado', async () =>{
        const novoAutor = ({
           nome: "Isabelle",
           data_nascimento: "2007-02-01"
        });
        const res = await request(app).post('/autores').send(novoAutor);
        expect(res.status).toBe(201);
        expect(res.body.Autor).toHaveProperty('nome', 'Isabelle');
    });

    it('Deve retornar erro 400 ao retornar autor sem nome', async () => {
        const novoAutor = ({
           data_nascimento: "2007-02-01"
        });
        const res = await request(app).post('/autores').send(novoAutor);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'nao foi possivel fazer o cadastro');
    });

    it('Deve retornar um autor pelo id', async () =>{
        const novoAutor = ({
           nome: "J.K. Rowling",
           data_nascimento: "1940-07-31"
        });
        const res = await request(app).post('/autores').send(novoAutor);
        const id = res.body.Autor.id;
        
        const res2 = await request(app).get(`/autores/${id}`);
        expect(res.status).toBe(201);
        expect(res2.status).toBe(200);
        expect(res2.body.Autor).toHaveProperty('nome','J.K. Rowling');
    });

    it('Deve retornar erro 404 quando buscar um autor que não existe', async() =>{
        const res = await request(app).get('/autores/999999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'autor nao encontrado')
    });

    it('Deve atualizar um autor', async () =>{
        const novoAutor = await db.Autor.create({
            nome: 'Henrique',
            data_nascimento: '2001-12-02',
        });
        const res = await request(app).put(`/autores/${novoAutor.id}`).send({nome: 'Novo nome'});
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/autores/${novoAutor.id}`);
        expect(res2.status).toBe(200);
        expect(res2.body.Autor).toHaveProperty('nome', 'Novo nome')
    });

    it('Deve deletar um autor', async () =>{
        const novoAutor = await db.Autor.create({
            nome: 'Henrique',
            data_nascimento: '2001-12-02',
        });
        const res = await request(app).delete(`/autores/${novoAutor.id}`);
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/autores/${novoAutor.id}`);
        expect(res2.status).toBe(404);
        expect(res2.body).toHaveProperty('message','autor nao encontrado');
    });

    afterAll(async () => {
        await db.sequelize.close();
       });
});