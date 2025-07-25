# Pastelaria PDV 🍴

Sistema de gerenciamento de ponto de venda para uma pastelaria. Permite cadastro e controle de clientes, produtos, pedidos e usuários por meio de uma API REST.

---

## 📦 Instalação e Uso

### 1. **Pré-requisitos**
- Node.js (versão 18 ou superior)
- MongoDB rodando localmente ou em nuvem

### 2. **Clonando o projeto**
```bash
git clone https://github.com/seu-usuario/pastelaria-pdv.git
cd pastelaria-pdv
```

### 3. **Instalando dependências**
```bash
npm install
```

### 4. **Configurando variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste conforme necessário):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pastelaria
JWT_SECRET=umaChaveSecretaForte123!@#
```

### 5. **Iniciando o servidor**
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:5000`.

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
| Método | Rota                   | Ação              |
| ------ | ---------------------- | ----------------- |
| POST   | `/api/users/register`  | Criar usuário     |
| POST   | `/api/users/login`     | Login de usuário  |
| GET    | `/api/users/:id`       | Buscar por ID     |
| PUT    | `/api/users/:id`       | Atualizar usuário |
| DELETE | `/api/users/:id`       | Deletar usuário   |

### 👥 `/api/clientes`
| Método | Rota                   | Ação                  |
| ------ | ---------------------- | --------------------- |
| POST   | `/api/clientes`        | Criar cliente         |
| GET    | `/api/clientes`        | Listar clientes       |
| GET    | `/api/clientes/:id`    | Buscar cliente por ID |
| PUT    | `/api/clientes/:id`    | Atualizar cliente     |
| DELETE | `/api/clientes/:id`    | Deletar cliente       |

### 📦 `/api/produtos`
| Método | Rota                   | Ação                  |
| ------ | ---------------------- | --------------------- |
| POST   | `/api/produtos`        | Criar produto         |
| GET    | `/api/produtos`        | Listar produtos       |
| GET    | `/api/produtos/:id`    | Buscar produto por ID |
| PUT    | `/api/produtos/:id`    | Atualizar produto     |
| DELETE | `/api/produtos/:id`    | Deletar produto       |

### 📏 `/api/pedidos`
| Método | Rota                           | Ação                        |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/api/pedidos`                 | Criar pedido                |
| GET    | `/api/pedidos`                 | Listar pedidos              |
| GET    | `/api/pedidos/:id`             | Buscar pedido por ID        |
| PATCH  | `/api/pedidos/:id/status`      | Atualizar status do pedido  |
| DELETE | `/api/pedidos/:id`             | Deletar pedido              |
| GET    | `/api/pedidos/:id/whatsapp`    | Gerar link do WhatsApp      |

---

## 📘 Documentação Interativa da API

Após iniciar o servidor, acesse:

```
http://localhost:5000/docs
```
para visualizar a documentação Swagger gerada a partir do arquivo `docs/swagger.yaml`.

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

- Autenticação JWT para rotas protegidas (em desenvolvimento)
- Middleware `authMiddleware.js` já criado para futuras proteções

---

## 📃 Exemplos de Dados

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

**Pedido:**
```json
{
  "cliente": "id_do_cliente",
  "produtos": [
    { "produto": "id_do_produto", "quantidade": 2 }
  ],
  "metodoEntrega": "balcao",
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

Feito com dedicação por Lincoln de Mello Ximenes

