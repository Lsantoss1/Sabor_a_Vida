# 🎨 Guia de Customização - Sabor à Vida

Este guia mostra como personalizar a aplicação para seu negócio.

---

## 🏢 Informações da Empresa

### Nome e Logo

**Arquivo:** `index.html` e `admin.html`

```html
<!-- Trocar o nome -->
<div class="nav-logo">
    <i class="fas fa-birthday-cake"></i>
    <span class="logo-text">SEU NOME AQUI</span>
</div>
```

### Informações de Contato

**Arquivo:** `index.html` (seção footer)

```html
<li><i class="fas fa-phone"></i> (XX) XXXXX-XXXX</li>
<li><i class="fas fa-envelope"></i> seu@email.com</li>
<li><i class="fas fa-clock"></i> Seu horário</li>
```

---

## 📱 WhatsApp

### Configurar Número

**Arquivo:** `js/app.js` (linha ~585)

```javascript
const whatsappNumber = '5511999999999'; // Formato: DDI + DDD + Número
```

**Formato correto:**
- Brasil: 55 + DDD + Número
- Exemplo SP: `5511999999999`
- Exemplo RJ: `5521999999999`

---

## 💰 Preços dos Produtos

### Alterar Valores

**Arquivos:** `index.html` + `js/app.js`

#### 1. HTML (Exibição)

```html
<!-- index.html -->
<span class="preco-valor">R$ XX,00</span>
```

#### 2. JavaScript (Lógica)

```javascript
// js/app.js - função openCustomizationModal()

// Mini Bolo
openCustomizationModal('mini', 12)  // Altere o 12

// Bolinho
openCustomizationModal('medio', 25) // Altere o 25

// Bolo Grande
openCustomizationModal('grande', 50) // Altere o 50
```

#### 3. Cobertura Extra

```javascript
// js/app.js - função updateModalTotal()
if (AppState.customization.coberturaExtra) {
    total += 2; // Altere o valor aqui
}
```

---

## 🍰 Sabores e Opções

### Adicionar Novos Sabores

**Arquivo:** `index.html`

#### Exemplo: Adicionar "Morango" nas massas

```html
<!-- Na seção #massaOptions -->
<button class="custom-option" data-value="morango">
    <span class="option-icon">🍓</span>
    <span>Morango</span>
</button>
```

#### Padrão para novos sabores:

```html
<button class="custom-option" data-value="nome-do-sabor">
    <span class="option-icon">🎂</span> <!-- Emoji do sabor -->
    <span>Nome do Sabor</span>
</button>
```

### Remover Sabores

Simplesmente delete ou comente o botão correspondente:

```html
<!-- 
<button class="custom-option" data-value="limao">
    <span class="option-icon">🍋</span>
    <span>Limão</span>
</button>
-->
```

---

## 🎨 Cores e Design

### Paleta de Cores

**Arquivo:** `css/style.css` (início do arquivo)

```css
:root {
    /* Altere estas cores */
    --primary: #ff6b9d;        /* Rosa principal */
    --primary-dark: #e8447a;   /* Rosa escuro */
    --secondary: #ffd93d;      /* Amarelo */
    --accent: #a05cff;         /* Roxo */
    --success: #6bcf7f;        /* Verde */
    --danger: #ff6b6b;         /* Vermelho */
}
```

### Gradientes

```css
:root {
    --gradient-primary: linear-gradient(135deg, #SUA_COR_1 0%, #SUA_COR_2 100%);
}
```

### Fontes

**Arquivo:** `index.html` e `admin.html`

```html
<!-- Altere para suas fontes preferidas -->
<link href="https://fonts.googleapis.com/css2?family=SuaFonte:wght@300;400;700&display=swap" rel="stylesheet">
```

```css
/* css/style.css */
:root {
    --font-primary: 'SuaFonte', sans-serif;
    --font-display: 'SuaFonteDisplay', serif;
}
```

---

## 🔐 Segurança Admin

### Alterar Credenciais

**Arquivo:** `js/admin.js` (linhas 14-17)

```javascript
const ADMIN_CREDENTIALS = {
    username: 'seu_usuario',
    password: 'sua_senha_segura'
};
```

⚠️ **IMPORTANTE:** Esta é uma implementação básica. Para produção, use:
- Sistema de autenticação real
- Backend seguro
- Banco de dados
- Hash de senhas

---

## 📦 Tamanhos dos Produtos

### Adicionar Novo Tamanho

**1. Adicionar Card no HTML:**

```html
<div class="produto-card fade-in-up" data-delay="3">
    <div class="produto-badge">Novo</div>
    <div class="produto-image">
        <div class="image-placeholder">
            <i class="fas fa-birthday-cake"></i>
        </div>
    </div>
    <div class="produto-content">
        <h3 class="produto-nome">Bolo Gigante</h3>
        <p class="produto-desc">Para festas grandes!</p>
        <div class="produto-specs">
            <span><i class="fas fa-ruler"></i> 25cm</span>
            <span><i class="fas fa-utensils"></i> 10+ pessoas</span>
        </div>
        <div class="produto-footer">
            <div class="produto-preco">
                <span class="preco-label">A partir de</span>
                <span class="preco-valor">R$ 80,00</span>
            </div>
            <button class="btn btn-add" onclick="openCustomizationModal('gigante', 80)">
                <i class="fas fa-plus"></i> Personalizar
            </button>
        </div>
    </div>
</div>
```

**2. Atualizar JavaScript:**

```javascript
// js/app.js - função getTamanhoNome()
function getTamanhoNome(tamanho) {
    const nomes = {
        'mini': 'Mini Bolo Vulcão',
        'medio': 'Bolinho Vulcão',
        'grande': 'Bolo Vulcão Grande',
        'gigante': 'Bolo Gigante'  // Adicione aqui
    };
    return nomes[tamanho] || 'Bolo Vulcão';
}
```

---

## 🖼️ Imagens Reais

### Substituir Placeholders

Atualmente usamos ícones. Para usar imagens reais:

**1. Adicione imagens à pasta:**
```
/images/
  ├── mini-bolo.jpg
  ├── bolinho.jpg
  └── bolo-grande.jpg
```

**2. Altere o HTML:**

```html
<!-- De: -->
<div class="image-placeholder">
    <i class="fas fa-cupcake"></i>
</div>

<!-- Para: -->
<div class="image-placeholder">
    <img src="images/mini-bolo.jpg" alt="Mini Bolo Vulcão">
</div>
```

**3. Ajuste o CSS se necessário:**

```css
.image-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

---

## 📊 Métricas Customizadas

### Adicionar Nova Métrica no Dashboard

**Arquivo:** `admin.html`

```html
<div class="stat-card">
    <div class="stat-icon" style="background: linear-gradient(135deg, #SEU_GRADIENT);">
        <i class="fas fa-seu-icone"></i>
    </div>
    <div class="stat-content">
        <h3 id="suaMetrica">0</h3>
        <p>Sua Métrica</p>
    </div>
</div>
```

**Arquivo:** `js/admin.js`

```javascript
// Na função loadDashboardData()
const suaMetrica = /* seu cálculo */;
document.getElementById('suaMetrica').textContent = suaMetrica;
```

---

## 🌐 Redes Sociais

### Atualizar Links

**Arquivo:** `index.html` (footer)

```html
<div class="social-links">
    <a href="https://instagram.com/seu_perfil" target="_blank">
        <i class="fab fa-instagram"></i>
    </a>
    <a href="https://facebook.com/sua_pagina" target="_blank">
        <i class="fab fa-facebook"></i>
    </a>
    <a href="https://wa.me/5511999999999" target="_blank">
        <i class="fab fa-whatsapp"></i>
    </a>
</div>
```

---

## 🎯 Textos e Mensagens

### Slogan e Descrições

**Arquivo:** `index.html`

```html
<!-- Hero Section -->
<h1 class="hero-title">
    Seu <span class="gradient-text">Slogan</span>
</h1>
<p class="hero-subtitle">
    Sua descrição personalizada aqui...
</p>
```

### Sobre a Empresa

```html
<!-- Seção Sobre -->
<p class="sobre-text">
    Sua história e diferenciais...
</p>
```

---

## 💳 Sistema de Pagamento

### Adicionar Métodos de Pagamento (Futuro)

Atualmente o sistema só registra pedidos. Para adicionar pagamento:

1. Integre com gateway (PagSeguro, MercadoPago, etc)
2. Adicione campos no checkout
3. Processe pagamento antes do WhatsApp
4. Salve status do pagamento

**Exemplo básico:**

```javascript
// Em handleCheckout()
const payment = await processPayment(order);
if (payment.success) {
    sendToWhatsApp(order);
}
```

---

## 📧 Notificações

### Adicionar Email (Requer Backend)

Para enviar emails:

1. Configure servidor backend (Node.js, PHP, etc)
2. Use serviço de email (SendGrid, AWS SES)
3. Envie junto com WhatsApp

---

## 🚀 Deploy e Produção

### Checklist Antes de Publicar

- [ ] Alterar número do WhatsApp
- [ ] Trocar credenciais do admin
- [ ] Atualizar informações de contato
- [ ] Personalizar cores e fontes
- [ ] Adicionar imagens reais
- [ ] Testar todos os fluxos
- [ ] Verificar responsividade
- [ ] Fazer backup dos dados
- [ ] Configurar domínio personalizado

---

## 💡 Dicas Avançadas

### 1. SEO
Adicione meta tags no `<head>`:

```html
<meta name="description" content="Sua descrição">
<meta name="keywords" content="bolos, vulcão, delivery">
<meta property="og:title" content="Sabor à Vida">
<meta property="og:description" content="Bolos vulcão artesanais">
```

### 2. Analytics
Adicione Google Analytics:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 3. Favicon
Adicione ícone personalizado:

```html
<link rel="icon" type="image/png" href="favicon.png">
```

---

## 🆘 Suporte

Ao customizar, mantenha sempre um backup dos arquivos originais!

**Boa customização!** 🎨✨
