/* ============================================
   TRACKING SYSTEM - SABOR À VIDA
   ============================================ */

function trackOrder() {
    const phoneInput = document.getElementById('trackPhone');
    const phone = phoneInput.value.replace(/\D/g, '');
    
    if (phone.length < 10) {
        showToast('Atenção', 'Digite um telefone válido', 'error');
        return;
    }
    
    // Buscar pedidos do telefone
    const orders = getOrdersByPhone(phone);
    
    if (orders.length === 0) {
        showNoOrdersFound();
        return;
    }
    
    // Mostrar último pedido
    displayOrderTracking(orders[orders.length - 1]);
}

function getOrdersByPhone(phone) {
    const allOrders = JSON.parse(localStorage.getItem('saboravidaOrders') || '[]');
    return allOrders.filter(order => {
        const orderPhone = order.telefone.replace(/\D/g, '');
        return orderPhone === phone;
    });
}

function showNoOrdersFound() {
    const trackResult = document.getElementById('trackResult');
    trackResult.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-search"></i>
            <h3>Nenhum pedido encontrado</h3>
            <p>Não encontramos pedidos com este telefone</p>
        </div>
    `;
    trackResult.style.display = 'block';
}

function displayOrderTracking(order) {
    const trackResult = document.getElementById('trackResult');
    
    const statusSteps = getStatusSteps(order.status);
    
    let stepsHTML = '';
    statusSteps.forEach((step, index) => {
        const stepClass = step.active ? 'active' : (step.completed ? 'completed' : '');
        stepsHTML += `
            <div class="status-step ${stepClass}">
                <div class="status-dot">
                    <i class="fas ${step.completed ? 'fa-check' : step.icon}"></i>
                </div>
                <div class="status-info">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                    ${step.time ? `<small>${step.time}</small>` : ''}
                </div>
            </div>
        `;
    });
    
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <span>${item.quantidade}x ${item.nome}</span>
                <span>${formatCurrency(item.total)}</span>
            </div>
        `;
    });
    
    trackResult.innerHTML = `
        <div class="order-status">
            <div class="status-header">
                <h3>Status do Pedido</h3>
                <p class="order-number">Pedido: ${order.id}</p>
            </div>
            
            <div class="status-timeline">
                ${stepsHTML}
            </div>
            
            <div class="order-details">
                <h4>Detalhes do Pedido</h4>
                ${itemsHTML}
                <div class="order-item" style="border-top: 2px solid var(--dark); margin-top: 1rem; padding-top: 1rem;">
                    <strong>Total</strong>
                    <strong style="color: var(--primary);">${formatCurrency(order.total)}</strong>
                </div>
            </div>
        </div>
    `;
    
    trackResult.style.display = 'block';
    trackResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getStatusSteps(currentStatus) {
    const allSteps = [
        {
            id: 'recebido',
            title: 'Pedido Recebido',
            description: 'Seu pedido foi recebido com sucesso',
            icon: 'fa-check',
            completed: true
        },
        {
            id: 'confirmado',
            title: 'Pedido Confirmado',
            description: 'Seu pedido foi confirmado e está sendo preparado',
            icon: 'fa-clipboard-check',
            completed: false,
            active: false
        },
        {
            id: 'preparando',
            title: 'Em Preparação',
            description: 'Estamos preparando seu bolo com muito carinho',
            icon: 'fa-fire',
            completed: false,
            active: false
        },
        {
            id: 'pronto',
            title: 'Pronto para Entrega',
            description: 'Seu pedido está pronto e saiu para entrega',
            icon: 'fa-box',
            completed: false,
            active: false
        },
        {
            id: 'entregue',
            title: 'Entregue',
            description: 'Pedido entregue com sucesso! Bom apetite! 🍰',
            icon: 'fa-check-circle',
            completed: false,
            active: false
        }
    ];
    
    const statusOrder = ['recebido', 'confirmado', 'preparando', 'pronto', 'entregue'];
    const currentIndex = statusOrder.indexOf(currentStatus) || 0;
    
    return allSteps.map((step, index) => {
        if (index < currentIndex) {
            step.completed = true;
        } else if (index === currentIndex) {
            step.active = true;
        }
        return step;
    });
}

// Expor funções globais
window.trackOrder = trackOrder;
