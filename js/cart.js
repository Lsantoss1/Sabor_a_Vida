/* ============================================
   CART UTILITIES - SABOR À VIDA
   ============================================ */

// Este arquivo contém funções auxiliares para o carrinho
// A lógica principal está em app.js

// Função para limpar carrinho
function clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        AppState.cart = [];
        saveCart();
        renderCart();
        updateCartBadge();
        showToast('Carrinho Limpo', 'Todos os itens foram removidos', 'info');
    }
}

// Função para calcular desconto (se houver promoções futuras)
function applyDiscount(code) {
    // Implementar lógica de cupom de desconto
    const validCodes = {
        'SABOR10': 0.1,
        'PRIMEIRA': 0.15,
        'VULCAO20': 0.2
    };
    
    if (validCodes[code]) {
        showToast('Desconto Aplicado!', `${validCodes[code] * 100}% de desconto`, 'success');
        return validCodes[code];
    } else {
        showToast('Código Inválido', 'Este cupom não existe ou expirou', 'error');
        return 0;
    }
}

// Função para calcular frete (implementação futura)
function calculateShipping(cep) {
    // Implementar cálculo de frete por CEP
    return 0; // Frete grátis por padrão
}

// Expor funções
window.clearCart = clearCart;
window.applyDiscount = applyDiscount;
window.calculateShipping = calculateShipping;
