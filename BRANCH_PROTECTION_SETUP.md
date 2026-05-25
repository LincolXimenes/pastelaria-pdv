# 🔒 Configuração de Branch Protection (OBRIGATÓRIO)

## ⚠️ AÇÃO NECESSÁRIA ANTES DE MERGEAR ESTE PR

Para evitar que PRs com falhas de segurança sejam mergeados automaticamente, você **DEVE** configurar Branch Protection no GitHub.

---

## 📋 Passo a Passo

### 1. Acessar Configurações do Repositório

1. Vá em: `Settings` > `Branches`
2. Clique em `Add branch protection rule` ou edite a regra existente

### 2. Configurar Proteção para `master`

**Branch name pattern:** `master`

### 3. Marcar as Seguintes Opções:

#### ✅ **Require a pull request before merging**
- ✅ Require approvals: **1** (mínimo)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (opcional, mas recomendado)

#### ✅ **Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging
- Adicione os seguintes checks obrigatórios:
  - `security-check`
  - `test (18)`
  - `test (20)`

#### ✅ **Require conversation resolution before merging**
- Garante que todos os comentários sejam resolvidos

#### ✅ **Do not allow bypassing the above settings**
- Mesmo admins precisam seguir as regras

#### ❌ **NÃO HABILITAR:**
- ❌ `Allow auto-merge` — **MANTER DESABILITADO**
- ❌ `Allow force pushes`
- ❌ `Allow deletions`

---

## 🚨 Por Que Isso É Crítico?

### Problema Anterior:
- PRs podiam ser mergeados automaticamente
- Código com `.env` foi aceito sem revisão
- Vulnerabilidades de segurança passaram despercebidas

### Com Branch Protection:
1. **Nenhum merge sem aprovação humana**
2. **Todos os checks devem passar** (security-check, tests)
3. **Conversas devem ser resolvidas**
4. **Novos commits invalidam aprovações anteriores**

---

## 🧪 Como Testar Se Está Funcionando

Depois de configurar, tente:

```bash
# 1. Criar um PR com .env (deve FALHAR no security-check)
echo "JWT_SECRET=teste" > .env
git add .env
git commit -m "test: tentando adicionar .env"
git push origin test-branch

# O GitHub Actions deve bloquear com erro
```

```bash
# 2. Criar um PR válido
git checkout -b feature/nova-funcionalidade
# fazer alterações
git push origin feature/nova-funcionalidade

# O PR vai aparecer como "Waiting for approval"
# Você precisará revisar e clicar "Approve"
```

---

## 📖 Documentação Oficial

- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)

---

## ✅ Checklist de Verificação

Antes de considerar este PR aprovado, confirme:

- [ ] Branch protection configurado no GitHub
- [ ] `Require approvals: 1` está ativo
- [ ] Status checks `security-check` e `test` são obrigatórios
- [ ] `Allow auto-merge` está **DESABILITADO**
- [ ] Testado criar PR com .env (deve falhar)
- [ ] Testado criar PR válido (deve pedir aprovação)

---

## 🔐 Segurança em Camadas

Esta configuração adiciona **3 camadas de proteção**:

1. **CI/CD:** Bloqueia arquivos sensíveis automaticamente
2. **Branch Protection:** Exige aprovação manual
3. **Code Review:** Olhos humanos em cada mudança

**Nenhuma falha de segurança passa despercebida novamente!** 🛡️
