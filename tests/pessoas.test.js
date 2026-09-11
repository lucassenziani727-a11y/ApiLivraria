import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll} from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs'

const pessoa = db.Pessoa

describe('Agrupando testes das pessoas', () =>{
    beforeEach(async () =>{
    await pessoa.destroy({where: {}})
    }); 
    
    it('Deve retornar a lista vazia de pessoas', async () =>{
      const res = await request(app).get('/pessoas')
      expect(res.status).toBe(200);
      expect(res.body).toEqual({"Pessoa": [], "message": "pessoa listada com sucesso"});
    });

    it('Deve retornar uma mensagem quando pessoa é criado', async () =>{
        const novaPessoa = ({
            nome:'Lucas',
            cpf:'12345612345',
            telefone:'426100-333'
        });
        const res = await request(app).post('/pessoas').send(novaPessoa);
        expect(res.status).toBe(201);
        expect(res.body.Pessoa).toHaveProperty('nome', 'Lucas');
        expect(res.body.Pessoa).toHaveProperty('cpf', '12345612345');
        expect(res.body.Pessoa).toHaveProperty('telefone', '426100-333');
    });

    it('Deve retornar erro 400 ao retornar pessoa sem nome', async () => {
        const novaPessoa = ({
            cpf:'12345612345',
            telefone:'426100-333'
        });
        const res = await request(app).post('/pessoas').send(novaPessoa);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'nao foi possivel fazer o cadastro');
    });

    it('Deve retornar um pessoa pelo id', async () =>{
        const novaPessoa = ({
            nome:'Lucas',
            cpf:'12345612345',
            telefone:'426100-333'
        });
        const res = await request(app).post('/pessoas').send(novaPessoa);
        const id = res.body.Pessoa.id;
        
        const res2 = await request(app).get(`/pessoas/${id}`);
        expect(res.status).toBe(201);
        expect(res2.status).toBe(200);
        expect(res2.body.Pessoa).toHaveProperty('nome','Lucas');
    });

    it('Deve retornar erro 404 quando buscar uma pessoa que não existe', async() =>{
        const res = await request(app).get('/pessoas/999999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'pessoa nao encontrada')
    });

    it('Deve atualizar a pessoa', async () =>{
        const novaPessoa = await db.Pessoa.create({
            nome:'Luca',
            cpf:'12345612346',
            telefone:'426100-222'
        });
        const res = await request(app).put(`/pessoas/${novaPessoa.id}`).send({nome: 'Lucas'});
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/pessoas/${novaPessoa.id}`);
        expect(res2.status).toBe(200);
        expect(res2.body.Pessoa).toHaveProperty('nome', 'Lucas')
    });

    it('Deve deletar uma pessoa', async () =>{
        const novaPessoa = await db.Pessoa.create({
            nome:'Luca',
            cpf:'12345612346',
            telefone:'426100-222',});
        const res = await request(app).delete(`/pessoas/${novaPessoa.id}`);
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/pessoas/${novaPessoa.id}`);
        expect(res2.status).toBe(404);
        expect(res2.body).toHaveProperty('message','pessoa nao encontrada');
    });

    afterAll(async () => {
        await db.sequelize.close();
       });
});