# Pastelaria PDV 🍴

Sistema de gerenciamento de ponto de venda para uma pastelaria. Permite cadastro e controle de clientes, produtos, pedidos e usuários.

---

## 📅 Visão Geral

**Tecnologias:** Node.js, Express, MongoDB, Mongoose

**Objetivo:** Gerenciar pedidos, clientes, produtos e usuários para uma pastelaria via API REST.

---

## 🗂️ Estrutura de Pastas

```
.
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
├── .env
├── package.json
```

---

## 👤 História de Usuário

**Como** funcionário da pastelaria, **Quero** cadastrar clientes, produtos e registrar pedidos,\
**Para** agilizar o atendimento no ponto de venda.

**Critérios de Aceitação:**

-

---

## ✅ Endpoints da API

### 🔐 `/api/users`

| Método | Rota             | Ação              |
| ------ | ---------------- | ----------------- |
| POST   | `/api/users`     | Criar usuário     |
| GET    | `/api/users`     | Listar todos      |
| GET    | `/api/users/:id` | Buscar por ID     |
| PUT    | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário   |

### 👥 `/api/clientes`

| Método | Rota                | Ação                  |
| ------ | ------------------- | --------------------- |
| POST   | `/api/clientes`     | Criar cliente         |
| GET    | `/api/clientes`     | Listar clientes       |
| GET    | `/api/clientes/:id` | Buscar cliente por ID |
| PUT    | `/api/clientes/:id` | Atualizar cliente     |
| DELETE | `/api/clientes/:id` | Deletar cliente       |

### 📦 `/api/produtos`

| Método | Rota                | Ação                  |
| ------ | ------------------- | --------------------- |
| POST   | `/api/produtos`     | Criar produto         |
| GET    | `/api/produtos`     | Listar produtos       |
| GET    | `/api/produtos/:id` | Buscar produto por ID |
| PUT    | `/api/produtos/:id` | Atualizar produto     |
| DELETE | `/api/produtos/:id` | Deletar produto       |

### 📏 `/api/pedidos`

| Método | Rota               | Ação                 |
| ------ | ------------------ | -------------------- |
| POST   | `/api/pedidos`     | Criar pedido         |
| GET    | `/api/pedidos`     | Listar pedidos       |
| GET    | `/api/pedidos/:id` | Buscar pedido por ID |
| PUT    | `/api/pedidos/:id` | Atualizar pedido     |
| DELETE | `/api/pedidos/:id` | Deletar pedido       |

---

## 💪 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- Dotenv para variáveis de ambiente
- Cors para liberar requisições
- Nodemon para hot reload
- Postman para testes

---

## 🔒 Autenticação (Futuro)

- Middleware `authMiddleware.js` já criado
- Futuramente usar JWT para proteger rotas

---

## 📃 Exemplo de Dados

**Produto:**

```json
{
  "nome": "Pastel de Carne",
  "preco": 8.5
}
```

**Cliente:**

```json
{
  "nome": "João Silva",
  "telefone": "11999999999"
}
```

---

## 🚀 Futuras Funcionalidades

-

---

## 📚 Licença

Este projeto é livre para fins de estudo e aprendizado. Para uso comercial, faça os devidos ajustes e testes.

---

Feito com ❤️ por Lincoln.

