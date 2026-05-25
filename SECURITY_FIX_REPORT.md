# Correções de Segurança Aplicadas

## ✅ Problemas Corrigidos (25/maio/2026)

### 1. **Arquivo .env removido do tracking do Git**
- ❌ **Problema:** `.env` estava sendo rastreado pelo git com `JWT_SECRET` exposto
- ✅ **Correção:** Removido do tracking com `git rm --cached .env`
- ✅ **Histórico limpo:** Usado `git filter-branch` para remover `.env` de **todos os 57 commits** do histórico
- ✅ **Repositório remoto atualizado:** Force push realizado com sucesso

### 2. **JWT_SECRET rotacionado**
- ❌ **Problema:** `JWT_SECRET=minhaChaveSecretaUltraSegura` estava exposto no histórico
- ✅ **Novo secret gerado:** Valor criptograficamente seguro (128 caracteres hex)
- ⚠️ **Importante:** Todos os tokens JWT antigos foram invalidados

### 3. **.gitignore corrigido**
- ❌ **Problema:** Arquivo truncado e incompleto
- ✅ **Correção:** Adicionado `.env.*`, logs completos, e `coverage/`

### 4. **.env.example criado**
- ✅ Template seguro para colaboradores
- ✅ Instruções para gerar JWT_SECRET seguro
- ✅ Não contém valores reais

### 5. **CI com verificação de segurança**
- ✅ Novo job `security-check` no GitHub Actions
- ✅ Bloqueia PRs que contenham `.env` rastreado
- ✅ Roda antes dos testes (fail-fast)

---

## 🔒 Status Atual

| Item | Status | Detalhes |
|------|--------|----------|
| `.env` rastreado | ✅ Removido | Não aparece em `git ls-files` |
| Histórico limpo | ✅ Reescrito | 57 commits processados com `filter-branch` |
| JWT_SECRET | ✅ Rotacionado | Novo valor seguro de 128 chars |
| CI/CD seguro | ✅ Ativo | Bloqueia `.env` em PRs |
| `.env.example` | ✅ Criado | Template disponível |
| Repositório remoto | ✅ Atualizado | Force push realizado |

---

## ⚠️ Avisos Importantes

### Para você (mantenedor do repositório):

1. **Tokens antigos foram invalidados**
   - Todos os usuários precisarão fazer login novamente
   - Se você tem deploy em produção, atualize o `JWT_SECRET` lá também

2. **Colaboradores precisam resincronizar**
   - Avise a equipe que o histórico foi reescrito
   - Eles precisarão fazer:
     ```bash
     git fetch origin
     git reset --hard origin/master
     ```

3. **Histórico local ainda contém commits antigos**
   - É seguro — eles não estão em nenhuma branch
   - Serão removidos pelo garbage collector do git eventualmente
   - Para forçar limpeza imediata: `git gc --aggressive --prune=now`

---

## 📋 Recomendações para o Futuro

### 1. Configure Branch Protection no GitHub

**Por que é importante:** Impede que PRs sejam mergeados sem aprovação e sem passar nos testes.

**Como configurar:**
1. Vá em: `Settings` > `Branches` > `Branch protection rules`
2. Adicione regra para `master`
3. Marque:
   - ✅ `Require status checks to pass before merging`
   - ✅ `security-check` (o job que criamos)
   - ✅ `test` (matriz completa Node 18+20)
   - ✅ `Require branches to be up to date before merging`
   - ✅ `Require a pull request before merging`
   - ✅ `Require approvals: 1`

### 2. Use GitHub Secrets para Deploy

Se você for configurar deploy automático (como no exemplo que você mencionou), **nunca coloque senhas diretamente no código**:

```yaml
# ✅ CORRETO - usa GitHub Secrets
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  MONGO_URI: ${{ secrets.MONGO_URI }}
```

```yaml
# ❌ ERRADO - senha no código
env:
  JWT_SECRET: minhaChaveSecretaUltraSegura
```

**Como adicionar Secrets:**
1. Vá em: `Settings` > `Secrets and variables` > `Actions`
2. Clique em `New repository secret`
3. Adicione: `JWT_SECRET`, `MONGO_URI`, `SSH_PRIVATE_KEY`, etc.

### 3. Monitore com Dependabot e CodeQL

**GitHub oferece ferramentas de segurança gratuitas:**
1. `Settings` > `Security` > `Code security and analysis`
2. Habilite:
   - ✅ `Dependabot alerts`
   - ✅ `Dependabot security updates`
   - ✅ `Secret scanning`

---

## 🚀 Deploy Seguro (para quando vocês configurarem)

Baseado no exemplo que você mencionou, aqui está como ficaria o workflow de deploy **seguro**:

```yaml
name: Deploy para Produção

on:
  push:
    branches:
      - master  # Só dispara em push direto no master (após PR aprovado)

jobs:
  security-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Verificar arquivos sensíveis
        run: |
          if git ls-files | grep -E '^\.env$|^\.env\.[^e]'; then
            echo "ERRO: Arquivo .env detectado"
            exit 1
          fi

  build-and-deploy:
    runs-on: ubuntu-latest
    needs: security-check  # Só roda se security-check passar

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Login no GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build e Push Docker
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}/api:latest

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/ubuntu/pastelaria-pdv
            docker compose pull
            docker compose up -d
```

**Secrets necessários para deploy:**
- `VPS_HOST`: IP da sua VPS
- `VPS_USER`: Usuário SSH (ex: `ubuntu`)
- `SSH_PRIVATE_KEY`: Chave privada SSH (conteúdo do arquivo `.pem`)

---

## 📚 Referências

- [GitHub - About secret scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [GitHub - Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Git - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

## ✅ Checklist de Segurança

Use esta lista sempre que fizer deploy ou aceitar PRs:

- [ ] `.env` está no `.gitignore`
- [ ] `.env` não aparece em `git ls-files`
- [ ] CI/CD usa GitHub Secrets para senhas
- [ ] Branch protection está ativa no `master`
- [ ] PRs são revisados antes do merge
- [ ] Secret scanning está ativo no repositório
- [ ] Dependabot está monitorando vulnerabilidades

---

**Correções aplicadas por:** GitHub Copilot  
**Data:** 25 de maio de 2026  
**Commit de correção:** `f9f3eb2`
