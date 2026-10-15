ApiLivraria

API REST para gerenciamento de uma biblioteca: cadastro de pessoas, livros, autores e empréstimos, com autenticação via JWT e renovação de sessão por refresh token.

Projeto de estudo focado em back-end com Node.js, onde o objetivo foi ir além do CRUD: autenticação, testes automatizados e decisões de segurança justificadas.

Tecnologias
Node.js (ES Modules) e Express
Sequelize (ORM) com SQLite
JWT (jsonwebtoken) para access tokens
bcryptjs para hash de senhas
crypto (nativo do Node) para geração e hash dos refresh tokens
Jest e Supertest para testes automatizados
Como rodar

Pré-requisito: Node.js instalado.

bash
# 1. clonar e entrar na pasta
git clone https://github.com/lucassenziani727-a11y/ApiLivraria
cd ApiLivraria

# 2. instalar as dependências
npm install

# 3. criar o arquivo .env na raiz (veja a seção abaixo)

# 4. criar as tabelas no banco
npx sequelize-cli db:migrate

# 5. subir o servidor em modo desenvolvimento
npm run dev

A API sobe em http://localhost:3000.

Variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

env
JWT_SECRET=uma_chave_longa_e_aleatoria

O .env não é versionado. Use uma chave diferente em cada ambiente.

Sem essa variável o servidor não sobe: o config/jwt.js lança um erro na inicialização.

Testes
bash
npm test

Os testes usam um banco separado (NODE_ENV=test) e rodam em sequência (--runInBand) para não disputar o mesmo arquivo SQLite.

Rotas

Rotas marcadas com autenticação exigem o header:

Authorization: Bearer <accessToken>

Em livros e autores, a leitura (GET) é pública e a escrita (POST, PUT, DELETE) exige token. Os empréstimos exigem token em todas as rotas, porque registram quem pegou cada livro.

Autenticação
Método	Rota	Autenticação	Descrição
POST	/login	Não	Recebe email e senha. Devolve accessToken e refreshToken
POST	/refresh	Não	Recebe refreshToken. Devolve um novo par de tokens
POST	/logout	Não	Recebe refreshToken e o revoga
Pessoas
Método	Rota	Autenticação	Descrição
POST	/pessoas	Não	Cadastra uma pessoa
GET	/pessoas	Sim	Lista as pessoas
GET	/pessoas/:id	Sim	Busca uma pessoa pelo id
PUT	/pessoas/:id	Sim	Atualiza uma pessoa
DELETE	/pessoas/:id	Sim	Remove uma pessoa
Livros
Método	Rota	Autenticação	Descrição
POST	/livros	Sim	Cadastra um livro
GET	/livros	Não	Lista os livros
GET	/livros/:id	Não	Busca um livro pelo id
PUT	/livros/:id	Sim	Atualiza um livro
DELETE	/livros/:id	Sim	Remove um livro
POST	/livros/:id/autores	Sim	Associa um autor a um livro
Autores
Método	Rota	Autenticação	Descrição
POST	/autores	Sim	Cadastra um autor
GET	/autores	Não	Lista os autores
GET	/autores/:id	Não	Busca um autor pelo id
PUT	/autores/:id	Sim	Atualiza um autor
DELETE	/autores/:id	Sim	Remove um autor
Empréstimos
Método	Rota	Autenticação	Descrição
POST	/emprestimos	Sim	Registra um empréstimo
GET	/emprestimos	Sim	Lista os empréstimos
GET	/emprestimos/:id	Sim	Busca um empréstimo pelo id
PUT	/emprestimos/:id	Sim	Atualiza um empréstimo
DELETE	/emprestimos/:id	Sim	Remove um empréstimo
Autenticação

O fluxo usa dois tokens com papéis diferentes:

Token	Validade	Para que serve
Access token	15 minutos	Vai em toda requisição às rotas protegidas
Refresh token	7 dias	Só serve para obter um novo par de tokens

Por que dois tokens? Um token único de 7 dias seria arriscado: se vazasse, o invasor teria uma semana de acesso. Um token único de 15 minutos obrigaria o usuário a digitar email e senha a cada 15 minutos. Com os dois, o access token que trafega o tempo todo morre rápido, e a sessão longa fica por conta do refresh token, que viaja pela rede muito menos vezes.

Login

POST /login valida email e senha (comparando com o hash bcrypt) e devolve:

json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "35e973558e6db1b0bb50b6262947f36d..."
}

Se o email não existe ou a senha está errada, a resposta é a mesma (401), para não revelar quais emails estão cadastrados.

Refresh e rotação

POST /refresh recebe o refresh token no body:

json
{ "refreshToken": "35e973558e6db1b0bb50b6262947f36d..." }

O servidor calcula o hash do token recebido, busca o registro no banco e confere se ele ainda é válido: existe, não foi revogado e não expirou. Se for, ele faz a rotação: o token usado é marcado como revogado, um novo é criado e os dois passos acontecem numa transação, de modo que ou ambos valem ou nenhum.

Consequência: um refresh token só pode ser usado uma vez. Reusar um token já consumido retorna 401.

Situação	Resposta
Token válido	200 com novo accessToken e novo refreshToken
refreshToken ausente no body	400
Token inexistente, expirado ou revogado	401, sempre com a mesma mensagem
Logout

POST /logout marca o refresh token recebido como revogado. Depois disso ele não renova mais nada. A resposta é 200 mesmo se o token já estiver revogado ou não existir: o resultado que o cliente quer ("esse token não vale mais") é verdadeiro nos dois casos.

Decisões de segurança
Refresh token guardado como hash. O token é gerado com randomBytes(40) e o banco armazena apenas o SHA-256 dele. Se a tabela vazar, os hashes não servem como credencial.
SHA-256 no refresh token e bcrypt na senha. Senhas têm pouca entropia (uma pessoa escolhe senha123), então o bcrypt, lento e com salt, torna cada tentativa de força bruta cara. O refresh token tem 320 bits aleatórios, sem lista de palpites para testar, então a lentidão não agrega nada. Além disso, o SHA-256 é determinístico, o que permite buscar o registro direto pelo hash. Com o salt do bcrypt, o mesmo token geraria hashes diferentes e a busca não funcionaria.
Mensagem de erro única para token inválido, expirado ou revogado, e para email ou senha incorretos.
Rotação em transação, para nunca deixar o usuário sem token novo com o antigo já invalidado.
Escrita protegida. Criar, alterar e remover livros, autores e empréstimos exige token. Os dados de empréstimos, que ligam pessoas a livros, não são públicos.
Limitações conhecidas
Access token após o logout. O logout revoga o refresh token, mas o access token continua válido até vencer (no máximo 15 minutos), porque o JWT é stateless e o servidor não consulta nada para validá-lo. Invalidar na hora exigiria uma lista de bloqueio, com uma consulta a cada requisição.
Requisições simultâneas no /refresh. Duas requisições com o mesmo token chegando ao mesmo tempo podem passar pela checagem antes de a primeira revogar. A correção seria um update condicional (WHERE revokedAt IS NULL) conferindo quantas linhas foram afetadas.
Tokens antigos acumulam na tabela. Tokens expirados e revogados não são removidos automaticamente. Uma rotina de limpeza periódica resolveria.
Múltiplas sessões. Cada login cria um refresh token novo sem revogar os anteriores, então a mesma pessoa pode ter várias sessões abertas.
Reuso de token consumido. Hoje ele só retorna 401. Sistemas maiores tratam isso como sinal de roubo e revogam toda a sessão do usuário.
Estrutura do projeto
├── config/        # configuração do banco (Sequelize) e do JWT
├── controllers/   # entrada e saída HTTP, traduz erros em status
├── middleware/    # autenticação do access token
├── migrations/    # criação e alteração das tabelas
├── models/        # models e associações do Sequelize
├── routes/        # definição das rotas
├── seeders/       # dados iniciais
├── services/      # regras de negócio
├── tests/         # testes com Jest e Supertest
├── utils/         # geração e hash do refresh token
├── app.js         # configuração do Express
└── server.js      # sobe o servidor