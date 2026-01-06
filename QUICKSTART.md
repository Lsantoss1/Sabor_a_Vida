# 🚀 Guia Rápido - Sabor à Vida

## ⚡ Início Rápido em 3 Passos

### 1️⃣ Abrir a Aplicação

**Página do Cliente:**

- Abra o arquivo `index.html` no seu navegador
- Ou acesse via servidor local: `http://localhost:8000`

**Painel Admin:**

- Abra o arquivo `admin.html` no seu navegador
- Ou acesse via servidor local: `http://localhost:8000/admin.html`

---

### 2️⃣ Testar como Cliente

1. **Escolha um produto** na seção "Produtos"
2. **Clique em "Personalizar"**
3. **Selecione:**
   - Sabor da massa (ex: Chocolate)
   - Sabor da massa (ex: Massa de Chocolate)
   - Cobertura (ex: Chocolate)
   - Acompanhamento (ex: Granulado)
   - Adicione cobertura extra se desejar (+R$ 2,00)
   - Defina a quantidade
4. **Clique em "Adicionar ao Carrinho"**
5. **Acesse o carrinho** clicando no ícone de carrinho no topo
6. **Finalize o pedido:**
   - Preencha: Nome, Telefone, Endereço
   - Adicione observações (opcional)
   - Clique em "Enviar Pedido via WhatsApp"
7. **Rastreie seu pedido:**
   - Vá para "Rastrear Pedido"
   - Digite o telefone usado no pedido
   - Veja o status em tempo real

---

### 3️⃣ Testar como Admin

1. **Acesse admin.html**
2. **Faça login:**
   - Usuário: `admin`
   - Senha: `sabor123`
3. **Explore o Dashboard:**
   - Veja métricas de vendas
   - Analise gráficos
4. **Gerencie Pedidos:**
   - Vá para "Pedidos"
   - Veja todos os pedidos
   - Atualize status:
     - Pendente → Confirmar
     - Confirmado → Iniciar Preparo
     - Em Preparação → Marcar como Pronto
     - Pronto → Marcar como Entregue
5. **Analise Financeiro:**
   - Veja faturamento mensal/semanal/diário
   - Analise evolução de vendas
6. **Veja Estatísticas de Produtos:**
   - Produtos mais vendidos
   - Sabores populares

---

## 🎯 Fluxo Completo de Teste

### Criar Pedido Completo

```
1. Cliente: Personaliza Mini Bolo (Chocolate + Doce de Leite + Granulado)
2. Cliente: Adiciona 2 unidades ao carrinho
3. Cliente: Preenche dados e finaliza
4. Sistema: Gera código SAV12345678
5. Sistema: Envia para WhatsApp (link é aberto)
6. Admin: Recebe notificação (badge no menu)
7. Admin: Confirma pedido (status: Confirmado)
8. Cliente: Rastreia pedido (vê status "Confirmado")
9. Admin: Inicia preparo (status: Em Preparação)
10. Admin: Marca como pronto (status: Pronto)
11. Admin: Marca como entregue (status: Entregue)
12. Cliente: Rastreia novamente (vê "Entregue")
```

---

## 🔧 Configurações Importantes

### Antes de Usar em Produção

1. **Alterar Número do WhatsApp**

   - Arquivo: `js/app.js`
   - Linha: ~585
   - Altere: `const whatsappNumber = '5511999999999';`

2. **Alterar Senha do Admin**

   - Arquivo: `js/admin.js`
   - Linhas: 14-17
   - Altere usuário e senha

3. **Personalizar Informações**
   - Nome da empresa
   - Endereço
   - Horário de funcionamento
   - Redes sociais

---

## 📱 Telas Principais

### Cliente (index.html)

| Seção        | Descrição                        |
| ------------ | -------------------------------- |
| **Home**     | Hero com apresentação da empresa |
| **Produtos** | 3 tamanhos de bolos com preços   |
| **Sobre**    | História e diferenciais          |
| **Rastrear** | Busca por telefone               |
| **Carrinho** | Gestão de itens e checkout       |

### Admin (admin.html)

| Seção             | Descrição                          |
| ----------------- | ---------------------------------- |
| **Dashboard**     | Métricas e gráficos gerais         |
| **Pedidos**       | Lista e gestão de todos os pedidos |
| **Financeiro**    | Faturamento e transações           |
| **Produtos**      | Estatísticas de vendas por produto |
| **Configurações** | Ajustes e exportação de dados      |

---

## 🎨 Recursos Visuais

### Design Highlights

- ✨ **Loading Screen** animado
- 🎭 **Animações** suaves em scroll
- 💫 **Glassmorphism** nos cards
- 🌈 **Gradientes** modernos
- 🔔 **Toast Notifications** estilizadas
- 📊 **Gráficos** interativos (Chart.js)
- 🎨 **Micro-interações** em botões
- 📱 **100% Responsivo**

---

## 💡 Dicas de Uso

### Para Desenvolvedores

1. **LocalStorage**: Todos os dados são salvos no navegador
2. **Limpar Dados**: Use DevTools → Application → Clear Storage
3. **Debug**: Abra Console (F12) para ver logs
4. **Editar Cores**: Altere CSS Variables em `css/style.css`
5. **Adicionar Sabores**: Edite HTML + JavaScript

### Para Lojistas

1. **Teste Primeiro**: Faça vários pedidos de teste
2. **Configure WhatsApp**: Número deve estar no formato internacional
3. **Acompanhe Métricas**: Use dashboard para análises
4. **Exporte Dados**: Regularmente faça backup dos pedidos
5. **Atualize Status**: Mantenha clientes informados

---

## 🚨 Solução Rápida de Problemas

### Carrinho vazio após recarregar

✅ Normal! Use o botão "Adicionar ao Carrinho"

### WhatsApp não abre

✅ Verifique o número configurado no código

### Pedido não aparece no admin

✅ Ambos devem usar o mesmo navegador/dispositivo (localStorage)

### Gráficos não carregam

✅ Verifique conexão com internet (CDN do Chart.js)

### Não consigo fazer login no admin

✅ Usuário: `admin` | Senha: `sabor123` (case-sensitive)

---

## 📚 Recursos Adicionais

- 📖 Documentação completa: `README.md`
- 🎨 Design system documentado
- 📊 Estrutura de dados detalhada
- 🔧 Guia de personalização

---

## 🎉 Pronto para Começar!

Agora você está pronto para explorar o **Sabor à Vida**!

**Comece fazendo um pedido de teste e depois gerencie no painel admin!** 🍰

---

**Dúvidas?** Consulte o `README.md` para documentação completa.

**Boas vendas!** 🚀
