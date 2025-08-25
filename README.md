# Pastelaria PDV 🍴

Sistema de gerenciamento de ponto de venda para uma pastelaria. Permite cadastro e controle de clientes, produtos, pedidos e usuários por meio de uma API REST.

---

## 📦 Instalação e Uso

### Manualmente

**Pré-requisitos**
- Node.js (18+)
- MongoDB rodando localmente ou em nuvem

**Clonando o projeto**
```bash
git clone https://github.com/LincolXimenes/pastelaria-pdv.git
cd pastelaria-pdv
```

**Instalando dependências**
```bash
npm install
```

**Configurando variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pastelaria
JWT_SECRET=umaChaveSecretaForte123!@#
JWT_EXPIRES_IN=1d
```

**Iniciando o servidor**
```bash
npm run dev
```
Acesse: [http://localhost:5000](http://localhost:5000)

---

### Com Docker

**Pré-requisitos**
- docker
- docker-compose

**Clonando o projeto**
```bash
git clone https://github.com/LincolXimenes/pastelaria-pdv.git
cd pastelaria-pdv
```

**Subindo os serviços**
```bash
docker-compose up -d
```
Acesse: [http://localhost:5000](http://localhost:5000)

---

## 🗂️ Estrutura de Pastas

```
.
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── docs/
│   └── swagger.yaml
├── server.js
├── .env
├── package.json
├── README.md
```

---

## ✅ Endpoints da API

### 🔐 `/api/users`
| Método | Rota                      | Ação              | Permissão         |
| ------ | ------------------------- | ----------------- | ---------------- |
| POST   | `/api/users/register`     | Criar usuário     | Admin            |
| POST   | `/api/users/login`        | Login de usuário  | Público          |
| GET    | `/api/users/:id`          | Buscar por ID     | Autenticado      |
| PUT    | `/api/users/:id`          | Atualizar usuário | Autenticado      |
| DELETE | `/api/users/:id`          | Deletar usuário   | Admin            |

### 👥 `/api/clientes`
| Método | Rota                        | Ação                  | Permissão         |
| ------ | --------------------------- | --------------------- | ---------------- |
| POST   | `/api/clientes/register`    | Criar cliente         | Público          |
| POST   | `/api/clientes/login`       | Login cliente         | Público          |
| GET    | `/api/clientes/me`          | Buscar próprio perfil | Cliente          |
| PUT    | `/api/clientes/me`          | Atualizar perfil      | Cliente          |
| DELETE | `/api/clientes/me`          | Deletar próprio perfil| Cliente          |
| GET    | `/api/clientes`             | Listar clientes       | Admin            |
| GET    | `/api/clientes/:id`         | Buscar cliente por ID | Admin            |
| PUT    | `/api/clientes/:id`         | Atualizar cliente     | Admin            |
| DELETE | `/api/clientes/:id`         | Deletar cliente       | Admin            |

### 📦 `/api/produtos`
| Método | Rota                         | Ação                  | Permissão                |
| ------ | ---------------------------- | --------------------- | ------------------------|
| POST   | `/api/produtos`              | Criar produto         | Admin, Funcionário      |
| GET    | `/api/produtos`              | Listar produtos       | Público                 |
| GET    | `/api/produtos/:id`          | Buscar produto por ID | Público                 |
| GET    | `/api/produtos/search?nome=` | Buscar produto por nome| Público                |
| PUT    | `/api/produtos/:id`          | Atualizar produto     | Admin, Funcionário      |
| PUT    | `/api/produtos/:id/estoque`  | Atualizar estoque     | Admin, Funcionário      |
| DELETE | `/api/produtos/:id`          | Deletar produto       | Admin                   |

### 📏 `/api/pedidos`
| Método | Rota                           | Ação                        | Permissão         |
| ------ | ------------------------------ | --------------------------- | ---------------- |
| POST   | `/api/pedidos`                 | Criar pedido                | Público/Cliente  |
| GET    | `/api/pedidos`                 | Listar pedidos              | Admin            |
| GET    | `/api/pedidos/:id`             | Buscar pedido por ID        | Autenticado      |
| PATCH  | `/api/pedidos/:id/status`      | Atualizar status do pedido  | Autenticado      |
| DELETE | `/api/pedidos/:id`             | Cancelar pedido             | Admin            |
| GET    | `/api/pedidos/:id/whatsapp`    | Gerar link do WhatsApp      | Autenticado      |

---

## 📘 Documentação Interativa da API

Acesse [http://localhost:5000/docs](http://localhost:5000/docs) para visualizar a documentação Swagger.

---

## 🧪 Testando a API

- Use o [Postman](https://www.postman.com/) ou o Swagger UI para testar todos os endpoints.
- Certifique-se de que o MongoDB está rodando antes de iniciar o servidor.

---

## 💪 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- Dotenv para variáveis de ambiente
- Cors para liberar requisições
- Nodemon para hot reload
- Swagger UI para documentação da API

---

## 🔒 Autenticação

- Autenticação JWT para rotas protegidas
- Middleware `authMiddleware.js` para proteção de rotas

---

## 📃 Exemplos de Dados

**Produto:**
```json
{
  "nome": "Pastel de Carne",
  "preco": 8.5,
  "quantidade": 10
}
```

**Cliente:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "11999999999"
}
```

**Pedido:**
```json
{
  "cliente": "id_do_cliente",
  "produtos": [
    { "produto": "id_do_produto", "quantidade": 2 }
  ],
  "metodoEntrega": "retirada",
  "taxaEntrega": 0
}
```

---

## 🚀 Futuras Funcionalidades

- Integração com WhatsApp
- Interface front-end para uso no balcão
- Relatórios de vendas e pedidos
- Login e permissões por perfil de usuário
- Tela de pedidos em tempo real (Socket.IO)
- Integração com impressora fiscal
- Dashboard com métricas de vendas

---

## 📚 Licença

Este projeto é livre para fins de estudo e aprendizado. Para uso comercial, faça os devidos ajustes e testes.

---

Feito com dedicação por:

- Lincoln de Mello Ximenes
- Thiago Fonseca
