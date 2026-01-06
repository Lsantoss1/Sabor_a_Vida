# 🍰 Sabor à Vida - Sistema de Vendas de Bolos Vulcão

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Sobre o Projeto

**Sabor à Vida** é uma aplicação web completa e moderna para vendas online de bolos vulcão artesanais. O sistema oferece uma experiência premium para clientes e um painel administrativo robusto para gestão de pedidos e análise de vendas.

### 🎯 Diferenciais

- ✨ **Design Ultra Moderno**: Interface com glassmorphism, gradientes avançados e animações suaves
- 🎨 **Personalização Total**: Sistema completo de customização de produtos
- 📱 **100% Responsivo**: Experiência perfeita em todos os dispositivos
- 🛒 **Carrinho Inteligente**: Sistema de carrinho com cálculo automático
- 📞 **Integração WhatsApp**: Envio automático de pedidos
- 📊 **Dashboard Admin**: Painel administrativo com métricas e gráficos em tempo real
- 🔍 **Rastreamento Online**: Clientes podem acompanhar pedidos por telefone
- 💰 **Gestão Financeira**: Relatórios detalhados de vendas e faturamento

---

## 🚀 Funcionalidades Implementadas

### 👥 Área do Cliente

#### 1. **Página Inicial (Home)**

- Hero section com estatísticas em tempo real
- Animações e elementos flutuantes
- Call-to-action destacados
- Seção "Sobre" com história da marca

#### 2. **Catálogo de Produtos**

- **Mini Bolo Vulcão (10cm)** - R$ 12,00
- **Bolinho Vulcão (14cm)** - R$ 25,00
- **Bolo Vulcão Grande (18cm)** - R$ 50,00

#### 3. **Sistema de Personalização**

**Sabores de Massa:**

- 🍫 Massa de Chocolate
- 🥚 Massa de Ovos Amanteigada
- 🥕 Massa de Cenoura

**Coberturas:**

- 🍫 Chocolate
- 🌰 Castanha
- 🥛 Ninho
- 🥜 Paçoca
- 🥛 Doce de Leite

**Acompanhamentos:**

- 🍫 Granulado
- 🍫 Gotas de Chocolate
- 🌰 Castanha
- 🥜 Amendoim
- 🥜 Paçoca
- ❌ Sem Acompanhamento

**Extras:**

- ➕ Cobertura Extra (+R$ 2,00)

#### 4. **Carrinho de Compras**

- Adicionar/remover produtos
- Alterar quantidades
- Cálculo automático de totais
- Persistência em localStorage
- Badge com contador de itens

#### 5. **Sistema de Checkout**

- Formulário completo de dados do cliente
- Validação de campos obrigatórios
- Máscara automática para telefone
- Campo de observações
- Resumo detalhado do pedido

#### 6. **Integração WhatsApp**

- Envio automático de pedidos formatados
- Mensagem completa com todos os detalhes
- Link direto para WhatsApp da empresa
- Geração de código de rastreamento

#### 7. **Rastreamento de Pedidos**

- Busca por número de telefone
- Timeline visual de status
- Status disponíveis:
  - 📥 Pedido Recebido
  - ✅ Pedido Confirmado
  - 🔥 Em Preparação
  - 📦 Pronto para Entrega
  - 🚚 Entregue

---

### 🔐 Painel Administrativo

#### Credenciais de Acesso

```
Usuário: admin
Senha: sabor123
```

#### 1. **Dashboard Principal**

**Métricas em Tempo Real:**

- 💰 Total de Vendas
- 🛒 Total de Pedidos
- ⏰ Pedidos do Dia
- 📈 Ticket Médio

**Gráficos:**

- 📊 Vendas por Período (últimos 7 dias)
- 🍰 Produtos Mais Vendidos (pizza chart)
- 📋 Lista de Pedidos Recentes

#### 2. **Gestão de Pedidos**

**Filtros por Status:**

- Todos os pedidos
- Pendentes
- Confirmados
- Em Preparação
- Prontos
- Entregues

**Ações Disponíveis:**

- ✅ Confirmar pedido
- 🔥 Iniciar preparação
- 📦 Marcar como pronto
- 🚚 Marcar como entregue
- ❌ Cancelar pedido

**Informações do Pedido:**

- Código do pedido
- Data e hora
- Dados do cliente (nome, telefone, endereço)
- Itens detalhados com personalizações
- Valor total
- Observações

#### 3. **Dashboard Financeiro**

**Métricas Financeiras:**

- 📅 Faturamento Mensal
- 📆 Faturamento Semanal
- 📊 Faturamento Diário
- 📈 Indicadores de crescimento

**Relatórios:**

- 📊 Gráfico de evolução financeira (30 dias)
- 💳 Histórico de transações
- 📑 Exportação de dados em JSON

#### 4. **Análise de Produtos**

**Estatísticas por Produto:**

- 🧁 Total de Mini Bolos vendidos
- 🎂 Total de Bolinhos vendidos
- 🍰 Total de Bolos Grandes vendidos

**Análise de Sabores:**

- 🏆 Top 5 combinações mais vendidas
- 📊 Visualização em barras de progresso
- 📈 Quantidade de pedidos por sabor

#### 5. **Configurações**

- 📱 Número do WhatsApp
- ⏰ Horário de funcionamento
- 💵 Taxa de entrega
- 📥 Exportar todos os dados
- 🗑️ Limpar base de dados

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com:
  - CSS Variables
  - Flexbox & Grid
  - Animations & Transitions
  - Glassmorphism
  - Gradients
- **JavaScript (ES6+)** - Lógica da aplicação
  - LocalStorage para persistência
  - Manipulação do DOM
  - Event Listeners
  - Modularização

### Bibliotecas e Frameworks

- **Google Fonts** - Tipografia (Poppins & Playfair Display)
- **Font Awesome 6.4.0** - Ícones vetoriais
- **Chart.js** - Gráficos interativos no admin

### Recursos Visuais

- **Gradientes Customizados**
- **Animações CSS avançadas**
- **Micro-interações**
- **Loading states**
- **Toast notifications**
- **Modal dialogs**

---

## 📁 Estrutura do Projeto

```
sabor-a-vida/
│
├── index.html              # Página principal do cliente
├── admin.html             # Painel administrativo
├── README.md              # Documentação
│
├── css/
│   ├── style.css          # Estilos principais
│   ├── animations.css     # Animações e efeitos
│   └── admin.css          # Estilos do painel admin
│
└── js/
    ├── app.js             # Lógica principal da aplicação
    ├── cart.js            # Funções do carrinho
    ├── tracking.js        # Sistema de rastreamento
    └── admin.js           # Lógica do painel admin
```

---

## 🎯 Fluxo de Uso

### Para Clientes

1. **Navegar pelo Site**

   - Visualizar produtos disponíveis
   - Conhecer a empresa na seção "Sobre"

2. **Escolher e Personalizar**

   - Clicar em "Personalizar" no produto desejado
   - Selecionar sabor da massa
   - Escolher cobertura
   - Definir acompanhamento
   - Adicionar cobertura extra (opcional)
   - Definir quantidade

3. **Adicionar ao Carrinho**

   - Revisar seleções
   - Verificar preço total
   - Adicionar ao carrinho

4. **Finalizar Pedido**

   - Acessar carrinho
   - Revisar itens
   - Clicar em "Finalizar Pedido"
   - Preencher dados (nome, telefone, endereço)
   - Adicionar observações (opcional)

5. **Enviar via WhatsApp**

   - Pedido é enviado automaticamente
   - Código de rastreamento é gerado
   - Aguardar confirmação

6. **Rastrear Pedido**
   - Acessar seção "Rastrear Pedido"
   - Digitar número de telefone
   - Visualizar status em tempo real

### Para Administradores

1. **Login**

   - Acessar `admin.html`
   - Fazer login com credenciais

2. **Dashboard**

   - Visualizar métricas gerais
   - Analisar gráficos de vendas
   - Ver pedidos recentes

3. **Gerenciar Pedidos**

   - Acessar seção "Pedidos"
   - Filtrar por status
   - Atualizar status dos pedidos
   - Ver detalhes completos

4. **Análise Financeira**

   - Verificar faturamento
   - Analisar evolução de vendas
   - Exportar relatórios

5. **Produtos**
   - Ver estatísticas de vendas
   - Analisar sabores populares
   - Identificar tendências

---

## 💾 Armazenamento de Dados

O sistema utiliza **LocalStorage** do navegador para persistência de dados:

### Chaves Utilizadas

```javascript
// Carrinho de compras do cliente
localStorage.getItem("saboravidaCart");

// Lista de todos os pedidos
localStorage.getItem("saboravidaOrders");

// Status de login do admin
localStorage.getItem("adminLoggedIn");
```

### Estrutura de Dados

**Pedido:**

```json
{
  "id": "SAV12345678",
  "nome": "João Silva",
  "telefone": "(11) 98765-4321",
  "endereco": "Rua das Flores, 123",
  "observacoes": "Entregar após às 18h",
  "items": [
    {
      "id": 1234567890,
      "tamanho": "mini",
      "nome": "Mini Bolo Vulcão",
      "precoUnitario": 12,
      "quantidade": 2,
      "massa": "chocolate",
      "cobertura": "chocolate",
      "acompanhamento": "granulado",
      "coberturaExtra": false,
      "total": 24
    }
  ],
  "total": 24,
  "data": "2024-01-15T10:30:00.000Z",
  "status": "recebido"
}
```

---

## 🎨 Design System

### Paleta de Cores

```css
/* Cores Principais */
--primary: #ff6b9d        /* Rosa vibrante */
--primary-dark: #e8447a   /* Rosa escuro */
--primary-light: #ffabc9  /* Rosa claro */
--secondary: #ffd93d      /* Amarelo dourado */
--accent: #a05cff         /* Roxo */
--success: #6bcf7f        /* Verde sucesso */
--danger: #ff6b6b         /* Vermelho perigo */

/* Cores Neutras */
--dark: #1a1a2e          /* Azul escuro */
--gray: #6c757d          /* Cinza médio */
--gray-light: #e9ecef    /* Cinza claro */
--white: #ffffff         /* Branco */
```

### Gradientes

```css
--gradient-primary: linear-gradient(135deg, #ff6b9d 0%, #ffc371 100%);
--gradient-secondary: linear-gradient(135deg, #a05cff 0%, #ff6b9d 100%);
--gradient-dark: linear-gradient(135deg, #2d3436 0%, #000000 100%);
```

### Tipografia

- **Fonte Display**: Playfair Display (títulos e logotipo)
- **Fonte Principal**: Poppins (corpo do texto)
- **Tamanhos**:
  - Hero: 4.5rem (72px)
  - Título de Seção: 3.5rem (56px)
  - Subtítulo: 1.2rem (19.2px)
  - Corpo: 1rem (16px)

### Espaçamentos

```css
--spacing-xs: 0.5rem   /* 8px */
--spacing-sm: 1rem     /* 16px */
--spacing-md: 2rem     /* 32px */
--spacing-lg: 3rem     /* 48px */
--spacing-xl: 4rem     /* 64px */
```

### Border Radius

```css
--radius-sm: 8px
--radius-md: 16px
--radius-lg: 24px
--radius-full: 9999px
```

---

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Mobile Small**: < 480px

### Adaptações Mobile

- Menu hambúrguer na navegação
- Grids adaptáveis (1 coluna)
- Botões e cards otimizados para toque
- Sidebar retrátil no admin
- Gráficos responsivos

---

## 🔧 Configuração e Personalização

### Alterar Número do WhatsApp

Em `js/app.js`, linha ~585:

```javascript
const whatsappNumber = "5500000000000"; // Altere aqui
```

### Alterar Credenciais do Admin

Em `js/admin.js`, linhas 12-15:

```javascript
const ADMIN_CREDENTIALS = {
  username: "admin", // Altere o usuário
  password: "sabor123", // Altere a senha
};
```

### Adicionar Novos Sabores

Em `index.html`, adicionar opções nos grupos:

```html
<!-- Massa -->
<button class="custom-option" data-value="novo-sabor">
  <span class="option-icon">🎂</span>
  <span>Novo Sabor</span>
</button>
```

### Alterar Preços

Em `index.html`, atualizar os valores nos cards de produtos e na função `openCustomizationModal()` em `js/app.js`.

---

## 🚀 Como Usar

### 1. Desenvolvimento Local

Basta abrir os arquivos HTML em um navegador:

```bash
# Abrir página do cliente
open index.html

# Abrir painel admin
open admin.html
```

### 2. Servidor Local (Recomendado)

Para melhor experiência, use um servidor local:

**Opção 1 - Python:**

```bash
python -m http.server 8000
```

**Opção 2 - Node.js:**

```bash
npx http-server -p 8000
```

Acesse: `http://localhost:8000`

### 3. Deploy

Para publicar online, use a **aba Publish** da plataforma ou hospede em:

- **Netlify** (recomendado)
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**

---

## 📊 Métricas e Análises

### Dashboard Exibe:

1. **Vendas Totais**: Soma de todos os pedidos
2. **Total de Pedidos**: Quantidade total
3. **Pedidos Hoje**: Pedidos do dia atual
4. **Ticket Médio**: Valor médio por pedido
5. **Gráfico de Vendas**: Evolução nos últimos 7 dias
6. **Produtos Mais Vendidos**: Distribuição por tamanho
7. **Faturamento Mensal/Semanal/Diário**
8. **Evolução Financeira**: Gráfico de 30 dias
9. **Sabores Populares**: Top 5 combinações

---

## 🔄 Recursos Futuros (Não Implementados)

Sugestões para expansão futura:

- [ ] Sistema de cupons de desconto
- [ ] Cálculo de frete por CEP
- [ ] Múltiplos métodos de pagamento
- [ ] Notificações push para clientes
- [ ] Sistema de avaliações e reviews
- [ ] Programa de fidelidade
- [ ] Agendamento de entrega
- [ ] Catálogo de fotos reais dos produtos
- [ ] Sistema de promoções e ofertas
- [ ] Integração com delivery apps
- [ ] Backend com banco de dados real
- [ ] Sistema de autenticação de clientes
- [ ] Relatórios em PDF
- [ ] Sistema de estoque
- [ ] Múltiplos usuários admin

---

## 🐛 Solução de Problemas

### Problema: Pedidos não aparecem no admin

**Solução**: Certifique-se de que o localStorage não está desabilitado no navegador. Tente em modo anônimo ou limpe o cache.

### Problema: WhatsApp não abre

**Solução**: Verifique se o número está correto no formato internacional (5500000000000) e se o WhatsApp está instalado.

### Problema: Gráficos não aparecem

**Solução**: Verifique a conexão com CDN do Chart.js. Certifique-se de estar com internet ativa.

### Problema: Animações não funcionam

**Solução**: Verifique se o navegador suporta CSS moderno. Atualize para a versão mais recente.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Desenvolvimento

**Projeto**: Sabor à Vida - Sistema de Vendas de Bolos Vulcão  
**Versão**: 1.0.0  
**Data**: Janeiro 2024  
**Tecnologias**: HTML5, CSS3, JavaScript ES6+, Chart.js

---

## 📞 Suporte

Para suporte e dúvidas:

- 📧 Email: saboraviida@gmail.com
- 📱 WhatsApp: (00) 00000-0000
- 🌐 Site: [Em breve]

---

## 🎉 Agradecimentos

Desenvolvido com 💖 e muito ☕ para transformar a experiência de compra de bolos vulcão em algo mágico e memorável!

**Sabor à Vida** - Exploda de Sabor! 🍰✨
