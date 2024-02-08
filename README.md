# nlw-polls

## 🚀 Projeto
API para criar, votar e consultar enquetes. Rotas HTTP REST e Websockets.</br>
Aplicação desenvolvida durante a Next Level Week, realizada pela [@Rocketseat](https://www.rocketseat.com.br) em fev/24.

Status: 🚧 Em construção 🚧

<p align="center">
  <img 
    width="70%" 
    alt="project-architecture"
    src="/github_assets/project-architecture.png"
  />
</p>

## 🛠️ Tecnologias
- [Node.js](https://nodejs.org/en/)
- [Prisma](https://www.prisma.io)
- [Docker](https://www.docker.com)
- [PostgreSQL](https://www.postgresql.org)
- [Redis](https://redis.io)

## 🗂️ Utilização

### 🐑🐑 Clonando o repositório:

```bash
  $ git clone url-do-projeto.git
```

### ▶️ Rodando o App:
```bash
  $ cd nlw-polls            #change to that directory
  $ cp .env.example .env    #create the ".env" file like the ".env.example" file
  $ docker compose up -d    #setup PostgreSQL and Redis containers
  $ npm install             #download dependencies to node_modules
  $ npx prisma migrate dev  #creates the db in the client
  $ npx prisma studio       #optional - db management thru a control panel in a web browser tab
  $ npm run dev             #start the project
```

## Rotas HTTP

### POST <code>/polls</code>
Cria uma nova enquete.

#### Request body
```json
{
  "title": "Qual o seu refrigerante favorito?",
  "options": ["Coca Cola", "Pepsi"]
}
```

#### Response body
```json
{
  "pollId": "194cef63-2ccf-46a3-aad1-aa94b2bc89b0"
}
```

### GET <code>/polls/:pollId</code>

Retorna dados de uma única enquete.

#### Response body

```json
{
  "poll": {
    "id": "194cef63-2ccf-46a3-aad1-aa94b2bc89b0",
    "title": "Qual o seu refrigerante favorito?",
    "options": [
      {
        "id": "4af3fca1-91dc-4c2d-b6aa-897ad5042c84",
        "title": "Coca Cola",
        "score": 10
      },
      {
        "id": "780b8e25-a40e-4301-ab32-77ebf8c79da8",
        "title": "Pepsi",
        "score": 20
      }
    ]
  }
}
```

### POST <code>/polls/:pollId/votes</code>

Vota em uma enquete.

#### Request body

```json
{
  "pollOptionId": "780b8e25-a40e-4301-ab32-77ebf8c79da8"
}
```
