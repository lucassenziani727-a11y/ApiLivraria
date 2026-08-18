# 📚 ApiLivraria

API REST para gerenciamento de biblioteca, construída com **Node.js**, **Sequelize** e **SQLite**. Projeto de estudo focado em modelagem relacional, ORM e boas práticas de arquitetura backend.

## 🎯 Sobre o projeto

A API gerencia o ciclo completo de uma biblioteca: cadastro de pessoas, livros, autores e o controle de empréstimos entre eles. O projeto foi construído do zero, com foco em entender profundamente:

- Modelagem de relacionamentos relacionais (1:N e N:N)
- Uso do Sequelize ORM (migrations, seeders, associations)
- Arquitetura MVC (models, controllers, routes)
- Tratamento de erros diferenciado por tipo (validação vs erro interno)

## 🛠️ Tecnologias

- **Node.js** — ambiente de execução
- **Express** — framework para rotas e middlewares
- **Sequelize** — ORM para banco relacional
- **SQLite** — banco de dados
- **dotenv** — variáveis de ambiente
- **nodemon** — reinício automático em desenvolvimento

## 🗂️ Modelagem de dados

O sistema é composto por 4 entidades principais:

| Entidade | Descrição |
|---|---|
| **Pessoa** | Usuário que pega livros emprestados |
| **Livro** | Item do acervo da biblioteca |
| **Autor** | Autor(es) de um livro |
| **Emprestimo** | Registro de um empréstimo (data, prazo, status) |

### Relacionamentos

- **Pessoa** `1:N` **Emprestimo** — uma pessoa pode ter vários empréstimos
- **Livro** `1:N` **Emprestimo** — um livro pode estar em vários empréstimos ao longo do tempo
- **Autor** `N:N` **Livro** (via tabela `LivroAutor`) — um autor pode ter vários livros, e um livro pode ter vários autores (coautoria)

```
Pessoa ─────┐
            ├──< Emprestimo >──┐
Livro ──────┘                  │
  │                            │
  └──< LivroAutor >── Autor    │
```

### Regras de integridade

- `Emprestimo → Pessoa` e `Emprestimo → Livro`: **RESTRICT** — impede deletar uma Pessoa ou Livro que tenha empréstimos, preservando o histórico
- `LivroAutor → Livro` e `LivroAutor → Autor`: **CASCADE** — a ligação é removida automaticamente se um dos dois lados for deletado

## 📁 Estrutura do projeto

```
ApiLivraria/
├── config/
│   └── config.json        # configuração de conexão (SQLite)
├── controllers/            # lógica de negócio de cada entidade
├── migrations/              # versionamento do schema do banco
├── models/                  # models Sequelize + associations
├── routes/                  # rotas HTTP de cada entidade
├── seeders/                  # dados de teste
├── app.js                    # ponto de entrada da aplicação
└── .env                       # variáveis de ambiente (não versionado)
```

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js instalado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/lucassenziani727-a11y/ApiLivraria.git
cd ApiLivraria

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env na raiz do projeto
PORT=3000

# 4. Rode as migrations
npx sequelize-cli db:migrate

# 5. Popule o banco com dados de teste (opcional)
npx sequelize-cli db:seed:all

# 6. Inicie o servidor
npm run dev
```

O servidor sobe em `http://localhost:3000`.

## 📡 Endpoints

Todas as entidades seguem o mesmo padrão de CRUD:

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/pessoas` | Cria uma pessoa |
| `GET` | `/pessoas` | Lista todas as pessoas |
| `GET` | `/pessoas/:id` | Busca uma pessoa por ID |
| `PUT` | `/pessoas/:id` | Atualiza uma pessoa |
| `DELETE` | `/pessoas/:id` | Remove uma pessoa |

O mesmo padrão se repete para `/autores`, `/livros` e `/emprestimos`.

### Relacionamentos na resposta

As buscas por ID de `/livros/:id` e `/autores/:id` retornam os relacionamentos N:N junto:

```json
GET /livros/1

{
  "message": "livro encontrado com sucesso",
  "Livro": {
    "id": 1,
    "titulo": "Senhor dos Anéis",
    "ano_lancamento": 2000,
    "genero": "Ação",
    "status": "Alugado",
    "autores": [
      { "id": 1, "nome": "John Doe" },
      { "id": 2, "nome": "Jane Doe" }
    ]
  }
}
```

### Exemplo de criação

```json
POST /emprestimos

{
  "data_emprestimo": "2026-08-14",
  "devolucao_prevista": "2026-08-21",
  "status": "Em andamento",
  "pessoaId": 1,
  "livroId": 1
}
```

## 🧠 Aprendizados do projeto

- Diferenciar `RESTRICT` e `CASCADE` com base em regras de negócio reais (preservar histórico vs remover ligações redundantes)
- Resolver conflitos entre ES Modules e CommonJS ao integrar código gerado automaticamente pelo `sequelize-cli`
- Usar `include` com `as` para trazer relacionamentos N:N nas consultas
- Separar erros de validação (`400`) de erros internos (`500`) no tratamento de exceções

## 👤 Autor

Lucas Senziani — [GitHub](https://github.com/lucassenziani727-a11y)

---

*Projeto de estudo desenvolvido durante a trilha de backend com Node.js.*
