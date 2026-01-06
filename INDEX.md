# 📑 Índice de Documentação - Sabor à Vida

## 🎯 Visão Geral

Sistema completo de vendas online de bolos vulcão com painel administrativo.

---

## 📚 Documentação Disponível

### 1. 📖 [README.md](README.md)

**Documentação Completa do Projeto**

- Descrição detalhada de todas as funcionalidades
- Estrutura técnica do projeto
- Guia de instalação e uso
- Documentação de APIs e dados
- Design system completo

### 2. 🚀 [QUICKSTART.md](QUICKSTART.md)

**Guia Rápido de Início**

- Como abrir a aplicação
- Teste rápido como cliente
- Teste rápido como admin
- Fluxo completo de demonstração
- Troubleshooting básico

### 3. 🎨 [CUSTOMIZACAO.md](CUSTOMIZACAO.md)

**Guia de Personalização**

- Alterar informações da empresa
- Configurar WhatsApp
- Modificar preços e produtos
- Customizar cores e design
- Adicionar novos sabores
- Personalizar textos

### 4. 💾 [DADOS_EXEMPLO.json](DADOS_EXEMPLO.json)

**Dados de Teste**

- Pedidos de exemplo prontos
- Estrutura de dados
- Como importar dados de teste

---

## 🗂️ Estrutura de Arquivos

```
sabor-a-vida/
│
├── 📄 index.html              # Página principal (cliente)
├── 📄 admin.html             # Painel administrativo
│
├── 📁 css/
│   ├── style.css            # Estilos principais
│   ├── animations.css       # Animações e efeitos
│   └── admin.css            # Estilos do admin
│
├── 📁 js/
│   ├── app.js              # Lógica principal
│   ├── cart.js             # Carrinho de compras
│   ├── tracking.js         # Rastreamento
│   └── admin.js            # Painel admin
│
├── 📚 Documentação/
│   ├── README.md           # Documentação completa
│   ├── QUICKSTART.md       # Início rápido
│   ├── CUSTOMIZACAO.md     # Guia de personalização
│   ├── INDEX.md            # Este arquivo
│   └── DADOS_EXEMPLO.json  # Dados de teste
│
└── 📋 .gitignore           # Arquivos ignorados pelo Git
```

---

## 🚀 Fluxos de Uso

### Para Usuários Finais (Clientes)

```
1. Acessar index.html
2. Escolher produto
3. Personalizar sabores
4. Adicionar ao carrinho
5. Preencher dados
6. Enviar via WhatsApp
7. Rastrear pedido
```

**Documentação:** [QUICKSTART.md - Seção Cliente](QUICKSTART.md#2️⃣-testar-como-cliente)

### Para Administradores

```
1. Acessar admin.html
2. Login (admin/sabor123)
3. Ver dashboard
4. Gerenciar pedidos
5. Analisar vendas
6. Exportar dados
```

**Documentação:** [QUICKSTART.md - Seção Admin](QUICKSTART.md#3️⃣-testar-como-admin)

### Para Desenvolvedores

```
1. Clonar/baixar projeto
2. Ler README.md completo
3. Configurar WhatsApp
4. Customizar conforme CUSTOMIZACAO.md
5. Testar localmente
6. Deploy via Publish tab
```

**Documentação:** [CUSTOMIZACAO.md](CUSTOMIZACAO.md)

---

## ⚙️ Configurações Essenciais

### 🔧 Antes de Usar

| Configuração    | Arquivo                    | Onde Alterar                                                     |
| --------------- | -------------------------- | ---------------------------------------------------------------- |
| Número WhatsApp | `js/app.js`                | Linha ~585                                                       |
| Senha Admin     | `js/admin.js`              | Linhas 14-17                                                     |
| Preços          | `index.html` + `js/app.js` | Ver [CUSTOMIZACAO.md](CUSTOMIZACAO.md#💰-preços-dos-produtos)    |
| Informações     | `index.html` (footer)      | Ver [CUSTOMIZACAO.md](CUSTOMIZACAO.md#🏢-informações-da-empresa) |

---

## 🎨 Personalização Rápida

### Cores

```css
/* css/style.css */
:root {
  --primary: #ff6b9d; /* Sua cor principal */
  --secondary: #ffd93d; /* Cor secundária */
}
```

### Produtos

- **Mini Bolo**: R$ 12,00 (10cm)
- **Bolinho**: R$ 25,00 (14cm)
- **Bolo Grande**: R$ 50,00 (18cm)
- **Cobertura Extra**: +R$ 2,00

### Sabores Disponíveis

- 5 tipos de massa
- 5 tipos de cobertura
- 5 tipos de acompanhamento

**Ver todos:** [CUSTOMIZACAO.md - Sabores](CUSTOMIZACAO.md#🍰-sabores-e-opções)

---

## 📊 Funcionalidades Principais

### Cliente

✅ Catálogo de produtos  
✅ Personalização total  
✅ Carrinho de compras  
✅ Checkout completo  
✅ Integração WhatsApp  
✅ Rastreamento online

### Admin

✅ Dashboard com métricas  
✅ Gestão de pedidos  
✅ Análise financeira  
✅ Gráficos interativos  
✅ Estatísticas de produtos  
✅ Exportação de dados

---

## 🔍 Busca Rápida

### Como fazer X?

| Quero...            | Consultar                                                        |
| ------------------- | ---------------------------------------------------------------- |
| Começar a usar      | [QUICKSTART.md](QUICKSTART.md)                                   |
| Entender tudo       | [README.md](README.md)                                           |
| Personalizar        | [CUSTOMIZACAO.md](CUSTOMIZACAO.md)                               |
| Testar com dados    | [DADOS_EXEMPLO.json](DADOS_EXEMPLO.json)                         |
| Mudar preços        | [CUSTOMIZACAO.md#preços](CUSTOMIZACAO.md#💰-preços-dos-produtos) |
| Alterar cores       | [CUSTOMIZACAO.md#cores](CUSTOMIZACAO.md#🎨-cores-e-design)       |
| Adicionar sabores   | [CUSTOMIZACAO.md#sabores](CUSTOMIZACAO.md#🍰-sabores-e-opções)   |
| Configurar WhatsApp | [CUSTOMIZACAO.md#whatsapp](CUSTOMIZACAO.md#📱-whatsapp)          |

---

## 🎯 Casos de Uso

### 1. Confeitaria Local

- Configure suas informações
- Personalize sabores
- Use WhatsApp para pedidos
- Gerencie entregas pelo admin

### 2. Home Baker

- Sistema completo sem custos
- Gestão profissional
- Analytics de vendas
- Crescimento organizado

### 3. Cloud Kitchen

- Múltiplos produtos
- Rastreamento online
- Dashboard de controle
- Escalável

---

## 💻 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Gráficos:** Chart.js
- **Ícones:** Font Awesome 6.4.0
- **Fontes:** Google Fonts (Poppins, Playfair Display)
- **Storage:** LocalStorage (navegador)

**Detalhes técnicos:** [README.md - Tecnologias](README.md#🛠️-tecnologias-utilizadas)

---

## 📱 Responsividade

✅ Desktop (> 1024px)  
✅ Tablet (768-1024px)  
✅ Mobile (< 768px)  
✅ Mobile Small (< 480px)

Funciona perfeitamente em todos os dispositivos!

---

## 🚨 Troubleshooting

### Problemas Comuns

**Carrinho vazio?**
→ [QUICKSTART.md#troubleshooting](QUICKSTART.md#🚨-solução-rápida-de-problemas)

**WhatsApp não abre?**
→ [CUSTOMIZACAO.md#whatsapp](CUSTOMIZACAO.md#📱-whatsapp)

**Não consigo fazer login?**
→ Usuário: `admin` | Senha: `sabor123`

**Gráficos não aparecem?**
→ Verifique conexão com internet (CDN)

---

## 🎓 Aprenda Mais

### Ordem Recomendada de Leitura

1. **Iniciante?**

   - Comece com [QUICKSTART.md](QUICKSTART.md)
   - Teste a aplicação
   - Depois leia [README.md](README.md)

2. **Vai customizar?**

   - Leia [CUSTOMIZACAO.md](CUSTOMIZACAO.md)
   - Use [DADOS_EXEMPLO.json](DADOS_EXEMPLO.json) para testes
   - Consulte [README.md](README.md) para detalhes técnicos

3. **Desenvolvedor?**
   - Comece com [README.md](README.md)
   - Estude a estrutura de código
   - Use [CUSTOMIZACAO.md](CUSTOMIZACAO.md) como referência

---

## 📞 Informações de Contato

### Sistema Sabor à Vida

- 📧 Email: saboraviida@gmail.com
- 📱 WhatsApp: (00) 00000-0000
- 🌐 Versão: 1.0.0

---

## 📄 Licença

Este projeto está sob licença MIT.

---

## 🎉 Começar Agora

**Novo no projeto?**  
👉 Comece com [QUICKSTART.md](QUICKSTART.md)

**Quer entender tudo?**  
👉 Leia [README.md](README.md)

**Vai personalizar?**  
👉 Veja [CUSTOMIZACAO.md](CUSTOMIZACAO.md)

**Precisa de dados de teste?**  
👉 Use [DADOS_EXEMPLO.json](DADOS_EXEMPLO.json)

---

**Boas vendas!** 🍰🚀
