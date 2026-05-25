# 🧪 Guia Completo: Como Testar as Rotas da API

## 📋 **Tipos de Rotas**

### 🔓 **Rotas Públicas** (não precisam de autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/users/register` | Criar primeiro usuário (vira admin automaticamente) |
| POST | `/api/users/login` | Login de usuário |
| POST | `/api/clientes/register` | Cadastro de cliente |
| POST | `/api/clientes/login` | Login de cliente |

### 🔒 **Rotas Protegidas** (requerem token JWT)

| Método | Endpoint | Permissão | Descrição |
|--------|----------|-----------|-----------|
| GET | `/api/users/:id` | Autenticado | Buscar usuário |
| PUT | `/api/users/:id` | Autenticado | Atualizar usuário |
| DELETE | `/api/users/:id` | Admin | Deletar usuário |
| GET | `/api/clientes/me` | Cliente | Ver próprio perfil |
| PUT | `/api/clientes/me` | Cliente | Atualizar próprio perfil |
| DELETE | `/api/clientes/me` | Cliente | Deletar própria conta |
| GET | `/api/clientes` | Admin | Listar todos clientes |
| GET | `/api/clientes/:id` | Admin | Buscar cliente específico |
| PUT | `/api/clientes/:id` | Admin | Atualizar cliente |
| DELETE | `/api/clientes/:id` | Admin | Deletar cliente |
| GET | `/api/produtos` | Público* | Listar produtos |
| POST | `/api/produtos` | Admin/Gerente | Criar produto |
| GET | `/api/produtos/:id` | Público* | Buscar produto |
| PUT | `/api/produtos/:id` | Admin/Gerente | Atualizar produto |
| DELETE | `/api/produtos/:id` | Admin | Deletar produto |
| POST | `/api/pedidos` | Autenticado | Criar pedido |
| GET | `/api/pedidos` | Autenticado | Listar pedidos |
| GET | `/api/pedidos/:id` | Autenticado | Buscar pedido |
| PATCH | `/api/pedidos/:id/status` | Admin/Gerente | Atualizar status |

\* *Algumas rotas podem estar protegidas dependendo da configuração*

---

## 🚀 **Método 1: Testar no Swagger UI** (Recomendado)

### Passo 1: Acessar Swagger
```
http://localhost:5000/docs
```

### Passo 2: Fazer Login

1. Encontre `POST /api/users/login`
2. Clique em **"Try it out"**
3. Cole este JSON:
```json
{
  "email": "admin@teste.com",
  "senha": "123456"
}
```
4. Clique em **"Execute"**
5. **Copie o token** da resposta (campo `token`)

**Exemplo de resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Passo 3: Autorizar no Swagger

1. Clique no botão **"Authorize"** 🔓 (topo da página)
2. Cole o token assim: `Bearer SEU_TOKEN_AQUI`
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Clique em **"Authorize"**
4. Clique em **"Close"**

### Passo 4: Testar Rotas Protegidas

Agora você pode testar qualquer rota! Exemplo:

**Listar produtos:**
1. Encontre `GET /api/produtos`
2. Clique em **"Try it out"**
3. Clique em **"Execute"**
4. Veja a resposta com os produtos

**Criar pedido:**
1. Encontre `POST /api/pedidos`
2. Clique em **"Try it out"**
3. Cole o JSON:
```json
{
  "cliente": "6a14dd0fc5fb43549bc3bb3b",
  "produtos": [
    {
      "produto": "ID_DO_PRODUTO_AQUI",
      "quantidade": 2
    }
  ],
  "metodoEntrega": "retirada"
}
```
4. Clique em **"Execute"**

---

## 🔧 **Método 2: Testar com cURL** (Terminal)

### Login e Obter Token
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teste.com","senha":"123456"}'
```

**Salve o token da resposta!**

### Testar Rota Protegida
```bash
# Substitua SEU_TOKEN_AQUI pelo token real
curl -X GET http://localhost:5000/api/produtos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Produto (exemplo)
```bash
curl -X POST http://localhost:5000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Pastel de Frango",
    "preco": 9.00,
    "categoria": "pastel",
    "quantidade": 30
  }'
```

---

## 🧪 **Método 3: Testar com Postman/Insomnia**

### Configuração Inicial

1. Criar uma **Collection** chamada "Pastelaria PDV"
2. Adicionar variável de ambiente:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (será preenchido após login)

### Requisição de Login

```
POST {{baseUrl}}/users/login
Content-Type: application/json

{
  "email": "admin@teste.com",
  "senha": "123456"
}
```

**Scripts (Postman):**
```javascript
// Salvar token automaticamente
pm.environment.set("token", pm.response.json().token);
```

### Requisição Protegida

```
GET {{baseUrl}}/produtos
Authorization: Bearer {{token}}
```

---

## 🐛 **Troubleshooting**

### Problema: "Token de acesso requerido"
**Solução:** Você não autorizou no Swagger ou esqueceu de adicionar o header `Authorization: Bearer TOKEN`

### Problema: "Token inválido"
**Solução:** 
- Token expirou (dura 1 dia). Faça login novamente.
- Token está malformado. Certifique-se de incluir `Bearer ` antes do token.

### Problema: "Permissão negada" (403)
**Solução:** Você não tem permissão para acessar essa rota.
- Rotas de Admin: só usuário com `role: "admin"`
- Rotas de Gerente: `role: "admin"` ou `"gerente"`
- Rotas de Cliente: `role: "cliente"`

### Problema: "MongoServerError: Transaction"
**Solução:** Pedidos usam transações do MongoDB. Você precisa:
- Usar Docker: `docker compose up -d`
- OU remover `?replicaSet=rs0` do MONGO_URI (mas pedidos não funcionarão corretamente)

---

## 📝 **Exemplos Práticos**

### 1. Registrar Novo Usuário
```bash
POST /api/users/register
{
  "nome": "João Silva",
  "email": "joao@teste.com",
  "senha": "senha123"
}
```

### 2. Criar Cliente
```bash
POST /api/clientes/register
{
  "nome": "Maria Santos",
  "email": "maria@teste.com",
  "senha": "senha123",
  "telefone": "(11) 98765-4321",
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  }
}
```

### 3. Listar Produtos (paginado)
```bash
GET /api/produtos?page=1&limit=10&categoria=pastel
```

### 4. Criar Pedido Completo
```bash
POST /api/pedidos
Headers: Authorization: Bearer TOKEN
{
  "cliente": "ID_DO_CLIENTE",
  "produtos": [
    {
      "produto": "ID_PASTEL_CARNE",
      "quantidade": 2
    },
    {
      "produto": "ID_REFRIGERANTE",
      "quantidade": 1
    }
  ],
  "metodoEntrega": "entrega",
  "observacoes": "Sem cebola"
}
```

### 5. Atualizar Status do Pedido (Admin/Gerente)
```bash
PATCH /api/pedidos/:id/status
Headers: Authorization: Bearer TOKEN
{
  "status": "concluido"
}
```

---

## ✅ **Checklist de Testes**

### Rotas Públicas
- [ ] POST /api/users/login (admin@teste.com / 123456)
- [ ] POST /api/clientes/login (cliente@teste.com / 123456)
- [ ] POST /api/users/register (criar novo usuário)
- [ ] POST /api/clientes/register (criar novo cliente)

### Rotas de Admin
- [ ] GET /api/clientes (listar todos)
- [ ] DELETE /api/users/:id
- [ ] DELETE /api/produtos/:id
- [ ] PATCH /api/pedidos/:id/status

### Rotas de Cliente
- [ ] GET /api/clientes/me
- [ ] PUT /api/clientes/me
- [ ] POST /api/pedidos

### Rate Limiting
- [ ] Testar 11 logins seguidos (deve bloquear na 11ª)
- [ ] Testar 6 registros seguidos (deve bloquear na 6ª)

---

## 🎯 **Dica Final**

**Use o Swagger!** É a forma mais fácil e visual de testar. Você vê:
- ✅ Estrutura exata do JSON esperado
- ✅ Códigos de resposta possíveis
- ✅ Exemplos pré-preenchidos
- ✅ Autorização visual

**Acesse agora:** http://localhost:5000/docs 🚀
