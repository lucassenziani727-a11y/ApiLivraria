import  request  from "supertest";
import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../app.js';
import db from '../models/index.cjs'

const emprestimo = db.Emprestimo;
const livro = db.Livro;
const pessoa = db.Pessoa;

describe('Agrupando Testes de emprestimos', () => {
  

  let novoLivro;
  let novaPessoa;

 
  beforeEach(async () => {
    await emprestimo.destroy({ where: {}, truncate: true });
    await livro.destroy({ where: {}, truncate: true });
    await pessoa.destroy({ where: {}, truncate: true });

    novoLivro = await db.Livro.create({ titulo: 'Coringa', ano_lancamento: 2024, genero: 'Ficção', status: 'Disponível' });
    novaPessoa = await db.Pessoa.create({ nome: 'Lucas', cpf: '12345678910', telefone: '439439-000' });
  });

  it('Criando emprestimo com id', async () =>{
    const dadosEmprestimo = {
     data_emprestimo: '2026-09-01',
     devolucao_prevista: '2026-09-15',
     status: 'Emprestado',
     pessoaId: novaPessoa.id,
     livroId: novoLivro.id
    };

    const res = await request(app).post("/emprestimos").send(dadosEmprestimo)
    expect(res.status).toBe(201);
    expect(res.body.Emprestimo).toHaveProperty('livroId', novoLivro.id);
    expect(res.body.Emprestimo).toHaveProperty('pessoaId', novaPessoa.id);
    expect(res.body.Emprestimo).toHaveProperty('status', 'Emprestado');
    })

    it('Criar um emprestimo sem livroId', async () =>{
        const dadosEmprestimo = {
     data_emprestimo: '2026-09-01',
     devolucao_prevista: '2026-09-15',
     status: 'Emprestado',
     pessoaId: novaPessoa.id,
     };
     const res = await request(app).post("/emprestimos").send(dadosEmprestimo);
     expect(res.status).toBe(400);
     expect(res.body).toHaveProperty('message', 'nao foi possivel fazer o cadastro');
    });

    it('Deve retornar a lista vazia de emprestimos', async() =>{
      const res = await request(app).get("/emprestimos");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({"Emprestimo": [], "message": "Emprestimo listado com sucesso"});
    });

    it('Deve retornar erro 404 quando buscar um emprestimo que não existe', async() =>{
        const res = await request(app).get("/emprestimos/444444");
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Emprestimo nao encontrado')
    });
});