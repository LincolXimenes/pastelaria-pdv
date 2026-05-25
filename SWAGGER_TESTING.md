# 🔧 Como Testar o Swagger

## Problema Identificado

O Swagger estava bloqueado pela configuração do Helmet.js com Content Security Policy (CSP) ativa.

## ✅ Correção Aplicada

**Arquivo:** `src/server.js`

```javascript
// Helmet configurado para permitir Swagger UI
app.use(helmet({
  contentSecurityPolicy: false, // CSP desabilitado para permitir inline scripts do Swagger
  crossOriginEmbedderPolicy: false
}));

// Swagger sempre disponível
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

---

## 🚀 Como Testar

### Opção 1: Com Docker (Recomendado)

```bash
# 1. Subir o MongoDB com replica set
docker compose up -d

# 2. Popular dados de teste
npm run seed

# 3. Iniciar servidor
npm run dev

# 4. Acessar Swagger
# http://localhost:5000/docs
```

### Opção 2: MongoDB Local (Sem Replica Set)

Se você não quer usar Docker, ajuste temporariamente o `.env`:

```env
# Remover ?replicaSet=rs0
MONGO_URI=mongodb://localhost:27017/pastelaria
```

**⚠️ IMPORTANTE:** Pedidos **NÃO funcionarão** sem replica set (usam transações).

Então:

```bash
# 1. Popular dados de teste
npm run seed

# 2. Iniciar servidor
npm run dev

# 3. Acessar Swagger
# http://localhost:5000/docs
```

### Opção 3: Testar Só o Swagger (Sem MongoDB)

Para apenas verificar se o Swagger carrega:

```bash
# 1. Comentar temporariamente a conexão MongoDB em src/server.js
# Linhas 64-75 (mongoose.connect...)

# 2. Iniciar servidor
npm run dev

# 3. Acessar Swagger
# http://localhost:5000/docs
```

---

## 👤 Credenciais de Teste (após `npm run seed`)

### Admin
- **Email:** `admin@teste.com`
- **Senha:** `123456`
- **Permissões:** Acesso total

### Cliente
- **Email:** `cliente@teste.com`
- **Senha:** `123456`
- **Permissões:** Apenas perfil próprio

### Produtos Criados
- Pastel de Carne - R$8,50
- Pastel de Queijo - R$7,50
- Refrigerante Lata - R$5,00

---

## 🧪 Testando no Swagger

### 1. Fazer Login (Obter Token)

```
POST /api/users/login
{
  "email": "admin@teste.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "_id": "...",
  "nome": "Admin Teste",
  "email": "admin@teste.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Autorizar no Swagger

1. Copie o **token** da resposta
2. Clique no botão **"Authorize"** (cadeado) no topo do Swagger
3. Cole: `Bearer SEU_TOKEN_AQUI`
4. Clique em **"Authorize"**

### 3. Testar Endpoints Protegidos

Agora você pode testar qualquer endpoint, por exemplo:

```
GET /api/produtos
GET /api/users/:id
POST /api/pedidos
```

---

## 🔍 Verificando Se Funcionou

### Swagger Carregou?
✅ Você deve ver a interface interativa em http://localhost:5000/docs

### Swagger Quebrado?
❌ Se aparecer tela branca ou erro de CSP, verifique:

1. **Console do navegador (F12):**
   - Erros de CSP? → Helmet mal configurado
   - Erros 404? → Rota `/docs` não registrada
   - Erros de CORS? → corsOptions.js mal configurado

2. **Terminal do servidor:**
   - Erro no YAML? → Problema no `swagger.yaml`
   - Erro de módulo? → `npm install` não executado

---

## 📝 Scripts Úteis

```bash
# Popular dados de teste
npm run seed

# Limpar banco de dados
npm run clear

# Rodar servidor em desenvolvimento
npm run dev

# Rodar testes
npm test
```

---

## 🐛 Troubleshooting

### Problema: "Cannot read property 'swagger' of undefined"
**Solução:** Verifique se o arquivo `swagger.yaml` existe e está válido

### Problema: Tela branca no /docs
**Solução:** CSP bloqueando. Certifique-se que `contentSecurityPolicy: false`

### Problema: "MongoError: Replica set not configured"
**Solução:** Use Docker com `docker compose up -d` ou remova `?replicaSet=rs0` do MONGO_URI

### Problema: "connect ECONNREFUSED"
**Solução:** MongoDB não está rodando. Inicie com `docker compose up -d`

---

## ✅ Checklist

Antes de reportar que o Swagger não funciona, confirme:

- [ ] Servidor está rodando (`npm run dev`)
- [ ] Sem erros no terminal
- [ ] MongoDB conectado (ou comentado para teste)
- [ ] Acessou `http://localhost:5000/docs` (não /api/docs)
- [ ] Navegador atualizado (Ctrl+F5)
- [ ] Console do navegador sem erros (F12)

---

**Correção aplicada em:** 25 de maio de 2026  
**Branch:** `security/fix-vulnerabilities`
