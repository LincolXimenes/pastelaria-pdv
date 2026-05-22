# Pastelaria PDV 🍴

Sistema completo de gerenciamento de ponto de venda para pastelarias. API REST robusta que permite controle total de clientes, produtos, pedidos e usuários com autenticação JWT e sistema de roles.

---

## 🚀 **Funcionalidades**

### **👥 Gestão de Usuários**
- ✅ Cadastro e autenticação de usuários
- ✅ Sistema de roles (Admin, Gerente, Funcionário)
- ✅ Primeiro usuário é automaticamente Admin
- ✅ Autenticação JWT com tokens seguros

### **👤 Gestão de Clientes**
- ✅ Cadastro e login de clientes
- ✅ Perfil próprio (visualizar/editar)
- ✅ Controle administrativo completo
- ✅ Validações robustas de dados

### **🥟 Gestão de Produtos**
- ✅ CRUD completo de produtos
- ✅ Categorias (pastel, bebida, doce, salgado, outros)
- ✅ Controle de estoque em tempo real
- ✅ Sistema de ativação/desativação
- ✅ Produtos em destaque

### **📋 Gestão de Pedidos**
- ✅ Criação de pedidos com múltiplos produtos
- ✅ Cálculo automático de totais
- ✅ Status em tempo real (pendente → concluído)
- ✅ Métodos de entrega (retirada/entrega)
- ✅ Geração de links do WhatsApp
- ✅ Controle automático de estoque

### **🔒 Segurança**
- ✅ Autenticação JWT
- ✅ Middleware de autorização
- ✅ Validação de dados robusta
- ✅ Senhas criptografadas (bcrypt)
- ✅ CORS configurado

### **📚 Documentação**
- ✅ API documentada com Swagger UI
- ✅ Endpoints interativos
- ✅ Exemplos de uso completos

---

## 🛠️ **Tecnologias Utilizadas**

- **Backend:** Node.js + Express.js
- **Banco de Dados:** MongoDB + Mongoose
- **Autenticação:** JWT (jsonwebtoken)
- **Segurança:** bcrypt, CORS
- **Documentação:** Swagger UI
- **Testes:** Jest
- **Desenvolvimento:** Nodemon, dotenv

---

## 📦 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- MongoDB (local ou remoto)
- Git

### **1. Clonar o repositório**
```bash
git clone https://github.com/LincolXimenes/pastelaria-pdv.git


cd pastelaria-pdv
```

### **2. Instalar dependências**
```bash
npm install
```

### **3. Configurar variáveis de ambiente**
Crie o arquivo `.env` na raiz do projeto:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pastelaria?replicaSet=rs0
JWT_SECRET=suaChaveSecretaAqui
JWT_EXPIRES_IN=1d
```

### **3.1 Subir com Docker Compose (Mongo com replica set)**
As transações de pedido exigem replica set no MongoDB. O `docker-compose.yml` já sobe um replica set de nó único (`rs0`) automaticamente.

```bash
docker compose up -d --build
```

Se você já tinha subido o projeto antes sem replica set, recrie o volume para executar a inicialização:

```bash
docker compose down -v
docker compose up -d --build
```

### **4. Iniciar o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### **5. Acessar a aplicação**
- **API:** http://localhost:5000
- **Documentação:** http://localhost:5000/docs

---

## 🧪 **Primeiros Passos**

### **1. Criar primeiro usuário (Admin)**
```bash
POST /api/users/register
{
  "nome": "Admin Principal",
  "email": "admin@pastelaria.com",
  "senha": "123456"
}
```

### **2. Fazer login**
```bash
POST /api/users/login
{
  "email": "admin@pastelaria.com", 
  "senha": "123456"
}
```

### **3. Usar token nas requisições autenticadas**
```bash
Authorization: Bearer SEU_TOKEN_AQUI
```

### **4. Criar produtos**
```bash
POST /api/produtos
{
  "nome": "Pastel de Carne",
  "preco": 8.50,
  "categoria": "pastel",
  "quantidade": 10
}
```
---

## 📚 **Documentação da API**

### **Endpoints Principais**

#### **Usuários**
- `POST /api/users/register` - Registrar usuário
- `POST /api/users/login` - Login usuário
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

#### **Clientes**
- `POST /api/clientes/register` - Registrar cliente
- `POST /api/clientes/login` - Login cliente
- `GET /api/clientes/me` - Perfil próprio
- `PUT /api/clientes/me` - Atualizar perfil
- `DELETE /api/clientes/me` - Deletar conta

#### **Produtos**
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `GET /api/produtos/:id` - Buscar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto
- `PUT /api/produtos/:id/estoque` - Atualizar estoque

#### **Pedidos**
- `POST /api/pedidos` - Criar pedido
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/:id` - Buscar pedido
- `PATCH /api/pedidos/:id/status` - Atualizar status
- `GET /api/pedidos/:id/whatsapp` - Gerar WhatsApp

### **Sistema de Roles**
- **Admin:** Acesso total
- **Gerente:** Gestão de produtos e pedidos
- **Funcionário:** Operações básicas
- **Cliente:** Apenas perfil próprio

---

## 🧪 **Testes**

- Utilize o [Postman](https://www.postman.com/) ou o Swagger UI para testar todos os endpoints.
- Certifique-se de que o MongoDB está rodando antes de iniciar o servidor.

```bash
# Executar todos os testes
npm test

# Executar testes específicos
npm test -- clientController

# Executar com coverage
npm run test:coverage
```

---

## 🚀 **Deploy**

### **Heroku**
```bash
# Login no Heroku
heroku login

# Criar app
heroku create pastelaria-pdv

# Configurar variáveis
heroku config:set MONGO_URI=sua_uri_mongodb
heroku config:set JWT_SECRET=sua_chave_secreta

# Deploy
git push heroku main
```

### **Docker**
```bash
# Build
docker build -t pastelaria-pdv .

# Run
docker run -p 5000:5000 --env-file .env pastelaria-pdv
```

---

## 💪 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- Dotenv para variáveis de ambiente
- Cors para liberar requisições
- Nodemon para hot reload
- Swagger UI para documentação da API

## 📁 **Estrutura do Projeto**

```
pastelaria-pdv/
├── src/
│   ├── config/
│   │   └── corsOptions.js
│   ├── controllers/
│   │   ├── clientController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validateRole.js
│   ├── models/
│   │   ├── clientModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── clientRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── clearDatabase.js
│   ├── utils/
│   │   ├── tokenUtils.js
│   │   └── whatsappUtils.js
│   └── server.js
├── test/
│   └── clientController.create.test.js
├── swagger.yaml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 **Autor**

**Lincoln de Mello Ximenes**
- GitHub: [@LincolXimenes/](https://github.com/LincolXimenes/)
- LinkedIn: [Lincoln Ximenes](https://www.linkedin.com/in/lincoln-ximenes-1a151393/)
- Email: lincolnximenes19@gmail.com

---

## ⭐ **Agradecimentos**

- **Thiago Fonseca**
- Comunidade Node.js
- Documentação do Express.js
- MongoDB University
- Stack Overflow

---

**⚡ Se este projeto foi útil para você, considere dar uma ⭐!**

