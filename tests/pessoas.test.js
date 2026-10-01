import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll, beforeAll} from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs'
import pessoaService from '../services/pessoaService.js';

const pessoa = db.Pessoa
const emprestimo = db.Emprestimo
const livroAutor = db.LivroAutor

describe('Agrupando testes das pessoas', () =>{
    let token;
    
    beforeAll(async () => {
       const dadosPessoaTeste = {
         nome: 'Usuario Teste',
         cpf: '00000000000',
         telefone: '00000000000',
         email: 'teste@teste.com',
         senha: 'senha123'
        };

        const cadastrarPessoaTeste = await pessoaService.cadastrar(dadosPessoaTeste);
        const fazerLoginPessoaTeste = await pessoaService.login({
         email: 'teste@teste.com',
         senha: 'senha123'})

         token = fazerLoginPessoaTeste

    })
    beforeEach(async () =>{
        await pessoa.destroy({where: {}})
    }); 
    
    it('Deve retornar a lista vazia de pessoas', async () =>{
      const res = await request(app).get('/pessoas').set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200);
      expect(res.body).toEqual({"Pessoa": [], "message": "pessoa listada com sucesso"});
    });

    it('Deve retornar uma mensagem quando pessoa é criado', async () =>{
        const novaPessoa = ({
            nome:'Lucas',
            cpf:'12345612345',
            telefone:'426100-555',
            email: 'moraes@teste.com',
            senha: 'senha122'
        });
        const res = await request(app).post('/pessoas').send(novaPessoa);
        expect(res.status).toBe(201);
        expect(res.body.Pessoa).toHaveProperty('nome', 'Lucas');
        expect(res.body.Pessoa).toHaveProperty('cpf', '12345612345');
        expect(res.body.Pessoa).toHaveProperty('telefone', '426100-555');
        expect(res.body.Pessoa).toHaveProperty('email', 'moraes@teste.com');
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
            telefone:'426100-333',
            email: 'cassolato@teste.com',
            senha: 'senha133'
        });
        const res = await request(app).post('/pessoas').send(novaPessoa);
        const id = res.body.Pessoa.id;
        
        const res2 = await request(app).get(`/pessoas/${id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res2.status).toBe(200);
        expect(res2.body.Pessoa).toHaveProperty('nome','Lucas');
    });

    it('Deve retornar erro 404 quando buscar uma pessoa que não existe', async() =>{
        const res = await request(app).get('/pessoas/999999').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'pessoa nao encontrada')
    });

    it('Deve atualizar a pessoa', async () =>{
        const novaPessoa = await db.Pessoa.create({
            nome:'Luca',
            cpf:'12345612346',
            telefone:'426100-444',
            email: 'cassolato@teste.com',
            senha: 'senha133'
        });
        const res = await request(app).put(`/pessoas/${novaPessoa.id}`).send({nome: 'Lucas'}).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/pessoas/${novaPessoa.id}`).set('Authorization', `Bearer ${token}`);
        expect(res2.status).toBe(200);
        expect(res2.body.Pessoa).toHaveProperty('nome', 'Lucas')
    });

    it('Deve deletar uma pessoa', async () =>{
        const novaPessoa = await db.Pessoa.create({
            nome:'Luca',
            cpf:'12345612346',
            telefone:'426100-333',
            email: 'senziani@teste.com',
            senha: 'senha132'
        });
        const res = await request(app).delete(`/pessoas/${novaPessoa.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const res2 = await request(app).get(`/pessoas/${novaPessoa.id}`).set('Authorization', `Bearer ${token}`);
        expect(res2.status).toBe(404);
        expect(res2.body).toHaveProperty('message','pessoa nao encontrada');
    });

    afterAll(async () => {
        await db.sequelize.close();
       });
});