
## Explorer Food API

Essa é uma aplicação em Node.js que utiliza TypeScript, Express, SQLite com Knex. Ela fornece uma API REST para realizar operações de CRUD (Create, Read, Update, Delete) nos pratos. E cadastra o usuário e o usuário adm, o adm pode adicionar ou remover os pratos e os dois podem buscar o prato pelo nome ou ingrediente.

## Instalação

Siga as etapas abaixo para configurar e executar a aplicação:

1.  Clone este repositório em sua máquina local:

```bash
  git clone https://github.com/Alexxcamargo1000/api-food-explorer.git
```

2. Instale as dependências necessárias:

```bash
npm install
```

3. Crie um arquivo .env na raiz do diretório e defina as variáveis de ambiente necessárias:

```bash
AUTH_SECRET=
PORT=
DATABASE_CLIENT=
NODE_ENV=
```
    
## Rotas

A aplicação disponibiliza as seguintes rotas:

**User**
- POST /users - Cadastrar um novo usuário.
- POST /users/admin - Cadastrar um admin.
- PUT /users/admin - Atualiza um usuário.
- DELETE /users/admin - Deleta um usuário.


**Food**
- GET /foods - Obter todos os pratos e seus respectivos ingredientes.
- GET /foods/:slug - Obter um prato específico e seus respectivos ingredientes pelo nome do prato.
- DELETE /foods/:id - Deleta um prato específico pelo ID.
- PUT /foods/:id - Atualiza um prato específico pelo ID.
- POST /foods - Cria um novo prato.

**Ingredient**

- GET /ingredients - Obter todos seus ingredientes.
- POST /ingredients - Criar um novo ingrediente.
- PUT /ingredients/:id - Atualizar um ingrediente existente pelo id.
- DELETE /ingredients/:id - Excluir um ingrediente pelo ID.

**Type-food**

- GET /type-food - Obter todos as categorias de prato.
- POST /type-food - Criar uma nova categoria.
- GET /type-food/:id - busca uma categoria por id.


Para as rotas que requerem autenticação, você precisa incluir o token JWT no cabeçalho da solicitação: