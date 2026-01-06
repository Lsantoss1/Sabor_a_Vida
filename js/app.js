/* ============================================
   SABOR À VIDA - MAIN APP
   ============================================ */

// Estado Global da Aplicação
const AppState = {
  cart: [],
  currentProduct: null,
  customization: {
    massa: null,
    cobertura: null,
    acompanhamento: null,
    coberturaExtra: false,
    quantidade: 1,
  },
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  loadCart();
  setupEventListeners();
  setupScrollEffects();

  // Garantir que todos os produtos estejam visíveis por padrão (fallback)
  document
    .querySelectorAll(".produto-card")
    .forEach((c) => (c.style.display = ""));

  // Remove loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }
  }, 1500);
});

function initApp() {
  console.log("🍰 Sabor à Vida - Aplicação Iniciada");
  updateCartBadge();
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Navegação
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      // Only intercept internal anchor navigation (hash links)
      if (href.startsWith("#")) {
        e.preventDefault();
        const section = link.getAttribute("data-section");
        navigateToSection(section);
      }
      // Otherwise allow normal navigation to other pages (ex: produtos.html)
    });
  });

  // Hamburger Menu
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Fechar menu ao clicar em link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
    });
  });

  // Checkout Form
  const checkoutForm = document.getElementById("checkoutForm");
  checkoutForm?.addEventListener("submit", handleCheckout);

  // Phone Masks
  setupPhoneMasks();

  // Note: category tabs are optional groupings for the special menu.
  // We do not auto-apply a filter here to avoid hiding content unexpectedly.
  const categoryBtns = document.querySelectorAll(".category-tab-btn");
  if (categoryBtns.length) {
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".category-tab-btn")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        filterCategory(btn.getAttribute("data-filter"));
      });
    });
  }

  // Fechar modais ao clicar no overlay (área fora da caixa do modal)
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        if (modal.id === "customizationModal") closeCustomizationModal();
        else if (modal.id === "checkoutModal") closeCheckoutModal();
      }
    });
  });
}

// ============================================
// NAVEGAÇÃO
// ============================================

function navigateToSection(section) {
  // Atualizar links ativos
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  document
    .querySelector(`[data-section="${section}"]`)
    ?.classList.add("active");

  // Mostrar/ocultar seções
  if (section === "carrinho") {
    showCartSection();
  } else {
    hideCartSection();
    scrollToSection(section);
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 80;
    const sectionTop = section.offsetTop - offset;
    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    });
  }
}

function goToProducts() {
  // Se a seção 'produtos' existir na página atual, faz scroll; caso contrário, redireciona para a página dedicada
  if (document.getElementById("produtos")) {
    scrollToSection("produtos");
  } else {
    window.location.href = "produtos.html";
  }
}

function setupScrollEffects() {
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    // Animação de elementos ao scroll
    animateOnScroll();
  });
}

function animateOnScroll() {
  const elements = document.querySelectorAll(".fade-in-up");

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;

    if (isVisible && !el.classList.contains("animated")) {
      el.classList.add("animated");
      el.style.animation = "fadeInUp 0.8s ease forwards";
    }
  });
}

// ============================================
// MODAL DE PERSONALIZAÇÃO
// ============================================

function openCustomizationModal(tamanho, preco) {
  const modal = document.getElementById("customizationModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");

  // Definir produto atual
  AppState.currentProduct = {
    tamanho: tamanho,
    precoBase: preco,
    nome: getTamanhoNome(tamanho),
  };

  // Resetar customização
  resetCustomization();

  // Atualizar textos
  modalTitle.textContent = `Personalize Seu ${getTamanhoNome(tamanho)}`;
  modalSubtitle.textContent = "Escolha os sabores perfeitos para você";

  // Atualizar preço inicial
  updateModalTotal();

  // Setup option buttons
  setupCustomizationButtons();

  // Mostrar modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// ============================================
// VARIANT SELECTION (1L / 2L etc)
// ============================================
function selectVariant(btn) {
  // Marca visualmente o botão selecionado e atualiza o preço exibido no card
  const container = btn.closest(".produto-card");
  if (!container) return;
  const siblings = container.querySelectorAll(".variant-btn");
  siblings.forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");

  const price = parseFloat(btn.getAttribute("data-price")) || 0;
  const precoEl = container.querySelector(".preco-valor");
  if (precoEl) {
    precoEl.textContent = formatCurrency(price);
  }

  // Armazena a seleção no próprio card para ser lida depois
  container.dataset.selectedPrice = price;
}

function openCustomizationModalWithVariant(el, tamanho) {
  // El pode ser o botão Personalizar; buscamos o card pai e a variante selecionada
  const btn = el instanceof Element ? el : document.querySelector(el);
  const container = btn.closest(".produto-card");
  if (!container) {
    // Fallback para comportamento antigo
    openCustomizationModal(tamanho, 0);
    return;
  }

  let price = 0;
  if (container.dataset.selectedPrice) {
    price = parseFloat(container.dataset.selectedPrice);
  } else {
    // tentar ler a primeira variante
    const first = container.querySelector(".variant-btn");
    if (first) price = parseFloat(first.getAttribute("data-price")) || 0;
    else {
      // tentar ler preço do elemento .preco-valor (remover símbolo)
      const precoEl = container.querySelector(".preco-valor");
      if (precoEl) {
        price =
          Number(
            precoEl.textContent.replace(/[^0-9,-]+/g, "").replace(",", ".")
          ) || 0;
      }
    }
  }

  // Abre modal com preço da variante escolhida
  openCustomizationModal(tamanho, price);
}

// Expor para uso em HTML
window.selectVariant = selectVariant;
window.openCustomizationModalWithVariant = openCustomizationModalWithVariant;

function closeCustomizationModal() {
  const modal = document.getElementById("customizationModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
  resetCustomization();
}

function setupCustomizationButtons() {
  // Massa
  const massaOptions = document.querySelectorAll(
    "#massaOptions .custom-option"
  );
  massaOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectOption("massa", btn, massaOptions);
    });
  });

  // Cobertura
  const coberturaOptions = document.querySelectorAll(
    "#coberturaOptions .custom-option"
  );
  coberturaOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectOption("cobertura", btn, coberturaOptions);
    });
  });

  // Acompanhamento
  const acompanhamentoOptions = document.querySelectorAll(
    "#acompanhamentoOptions .custom-option"
  );
  acompanhamentoOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectOption("acompanhamento", btn, acompanhamentoOptions);
    });
  });

  // Cobertura Extra
  const coberturaExtra = document.getElementById("coberturaExtra");
  coberturaExtra.addEventListener("change", () => {
    AppState.customization.coberturaExtra = coberturaExtra.checked;
    updateModalTotal();
  });
}

function selectOption(type, button, allButtons) {
  allButtons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
  AppState.customization[type] = button.getAttribute("data-value");
  updateModalTotal();
}

function resetCustomization() {
  AppState.customization = {
    massa: null,
    cobertura: null,
    acompanhamento: null,
    coberturaExtra: false,
    quantidade: 1,
  };

  // Limpar seleções
  document.querySelectorAll(".custom-option").forEach((btn) => {
    btn.classList.remove("selected");
  });

  document.getElementById("coberturaExtra").checked = false;
  document.getElementById("quantity").value = 1;
}

function updateModalTotal() {
  if (!AppState.currentProduct) return;

  let total = AppState.currentProduct.precoBase;

  if (AppState.customization.coberturaExtra) {
    total += 2;
  }

  total *= AppState.customization.quantidade;

  document.getElementById("modalTotal").textContent = formatCurrency(total);
}

function increaseQuantity() {
  const input = document.getElementById("quantity");
  const current = parseInt(input.value);
  input.value = current + 1;
  AppState.customization.quantidade = current + 1;
  updateModalTotal();
}

function decreaseQuantity() {
  const input = document.getElementById("quantity");
  const current = parseInt(input.value);
  if (current > 1) {
    input.value = current - 1;
    AppState.customization.quantidade = current - 1;
    updateModalTotal();
  }
}

// ============================================
// ADICIONAR AO CARRINHO
// ============================================

function addToCart() {
  const { massa, cobertura, acompanhamento, coberturaExtra, quantidade } =
    AppState.customization;

  // Validar seleções
  if (!massa || !cobertura || !acompanhamento) {
    showToast("Atenção!", "Por favor, selecione todos os sabores", "error");
    return;
  }

  // Criar item do carrinho
  const cartItem = {
    id: Date.now(),
    tamanho: AppState.currentProduct.tamanho,
    nome: AppState.currentProduct.nome,
    precoUnitario: AppState.currentProduct.precoBase + (coberturaExtra ? 2 : 0),
    quantidade: quantidade,
    massa: massa,
    cobertura: cobertura,
    acompanhamento: acompanhamento,
    coberturaExtra: coberturaExtra,
    total:
      (AppState.currentProduct.precoBase + (coberturaExtra ? 2 : 0)) *
      quantidade,
  };

  // Adicionar ao carrinho
  AppState.cart.push(cartItem);
  saveCart();
  updateCartBadge();

  // Fechar modal e mostrar notificação
  closeCustomizationModal();
  // Redirecionar automaticamente ao carrinho
  showCartSection();
  showToast("Sucesso!", "Produto adicionado ao carrinho", "success");
}

function getTamanhoNome(tamanho) {
  const nomes = {
    mini: "Mini Bolo Vulcão",
    medio: "Bolinho Vulcão",
    grande: "Bolo Vulcão Grande",
  };
  return nomes[tamanho] || "Bolo Vulcão";
}

function getTamanhoIcon(tamanho) {
  const icons = {
    mini: "fa-cupcake",
    medio: "fa-cake-candles",
    grande: "fa-birthday-cake",
  };
  return icons[tamanho] || "fa-cake-candles";
}

// ============================================
// CARRINHO
// ============================================

function showCartSection() {
  const carrinhoSection = document.getElementById("carrinho");
  if (carrinhoSection) {
    carrinhoSection.style.display = "block";
    carrinhoSection.scrollIntoView({ behavior: "smooth", block: "start" });
    renderCart();
  } else {
    // Se não houver seção de carrinho nesta página, redireciona para a página de produtos
    window.location.href = "produtos.html#carrinho";
  }
}

function hideCartSection() {
  const carrinhoSection = document.getElementById("carrinho");
  if (carrinhoSection) {
    carrinhoSection.style.display = "none";
  }
}

function renderCart() {
  const carrinhoItems = document.getElementById("carrinhoItems");
  const carrinhoSummary = document.getElementById("carrinhoSummary");

  // Se a página atual não contém o markup do carrinho, não tenta renderizar aqui
  if (!carrinhoItems || !carrinhoSummary) {
    updateCartBadge();
    return;
  }

  if (AppState.cart.length === 0) {
    carrinhoItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos deliciosos ao seu carrinho!</p>
                <button class="btn btn-primary" onclick="goToProducts()">
                  Ver Produtos
                </button>
            </div>
        `;
    carrinhoSummary.style.display = "none";
    return;
  }

  // Renderizar itens
  let itemsHTML = "";
  AppState.cart.forEach((item) => {
    itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${getTamanhoIcon(item.tamanho)}"></i>
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.nome}</h3>
                    <p class="cart-item-custom">🍫 Massa: ${formatOption(
                      item.massa
                    )}</p>
                    <p class="cart-item-custom">🍨 Cobertura: ${formatOption(
                      item.cobertura
                    )}</p>
                    <p class="cart-item-custom">🍓 Acompanhamento: ${formatOption(
                      item.acompanhamento
                    )}</p>
                    ${
                      item.coberturaExtra
                        ? '<p class="cart-item-custom">➕ Cobertura Extra</p>'
                        : ""
                    }
                    <p class="cart-item-price">${formatCurrency(item.total)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button onclick="updateCartItemQty(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantidade}</span>
                        <button onclick="updateCartItemQty(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="cart-item-remove" onclick="removeCartItem(${
                      item.id
                    })">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `;
  });

  carrinhoItems.innerHTML = itemsHTML;

  // Atualizar resumo
  const subtotal = AppState.cart.reduce((sum, item) => sum + item.total, 0);
  document.getElementById("subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("totalGeral").textContent = formatCurrency(subtotal);
  carrinhoSummary.style.display = "block";
}

function updateCartItemQty(itemId, change) {
  const item = AppState.cart.find((i) => i.id === itemId);
  if (item) {
    item.quantidade += change;
    if (item.quantidade <= 0) {
      removeCartItem(itemId);
      return;
    }
    item.total = item.precoUnitario * item.quantidade;
    saveCart();
    renderCart();
    updateCartBadge();
  }
}

function removeCartItem(itemId) {
  AppState.cart = AppState.cart.filter((i) => i.id !== itemId);
  saveCart();
  renderCart();
  updateCartBadge();
  showToast("Removido", "Item removido do carrinho", "info");
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const totalItems = AppState.cart.reduce(
    (sum, item) => sum + item.quantidade,
    0
  );
  if (!badge) {
    // Elemento não existe no DOM (carregado em páginas sem header/carrinho)
    return;
  }
  badge.textContent = totalItems;
  // Esconder badge quando vazio para evitar mostrar '0'
  badge.style.display = totalItems > 0 ? "inline-block" : "none";
}

function saveCart() {
  localStorage.setItem("saboravidaCart", JSON.stringify(AppState.cart));
}

function loadCart() {
  const saved = localStorage.getItem("saboravidaCart");
  if (saved) {
    AppState.cart = JSON.parse(saved);
    updateCartBadge();
  }
}

// ============================================
// CHECKOUT
// ============================================

function openCheckoutModal() {
  if (AppState.cart.length === 0) {
    showToast("Atenção", "Seu carrinho está vazio", "error");
    return;
  }

  const modal = document.getElementById("checkoutModal");

  // Renderizar itens do checkout
  let itemsHTML = "";
  AppState.cart.forEach((item) => {
    itemsHTML += `
            <div class="checkout-item">
                <span>${item.quantidade}x ${item.nome}</span>
                <span>${formatCurrency(item.total)}</span>
            </div>
        `;
  });

  document.getElementById("checkoutItems").innerHTML = itemsHTML;

  const total = AppState.cart.reduce((sum, item) => sum + item.total, 0);
  document.getElementById("checkoutTotal").textContent = formatCurrency(total);

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

async function handleCheckout(e) {
  e.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const notes = document.getElementById("customerNotes").value.trim();

  if (!name || !phone || !address) {
    showToast("Atenção", "Preencha todos os campos obrigatórios", "error");
    return;
  }

  // Criar pedido (salva localmente em createOrder)
  const order = createOrder(name, phone, address, notes);

  // Tentar salvar no Firestore se disponível (não bloqueia envio ao WhatsApp)
  if (window.FirebaseDB && FirebaseDB.saveOrder) {
    try {
      const saved = await FirebaseDB.saveOrder(order);
      if (!saved) console.warn("Pedido não salvo remotamente.");
    } catch (err) {
      console.error("Erro ao salvar pedido no Firestore:", err);
    }
  }

  // Enviar para WhatsApp
  sendToWhatsApp(order);

  // Limpar carrinho
  AppState.cart = [];
  saveCart();
  updateCartBadge();

  // Fechar modal
  closeCheckoutModal();

  // Mostrar mensagem de sucesso
  showToast("Pedido Enviado!", "Aguarde confirmação no WhatsApp", "success");

  // Navegar para home
  setTimeout(() => {
    navigateToSection("home");
  }, 2000);
}

function createOrder(name, phone, address, notes) {
  const orderId = generateOrderId();
  const order = {
    id: orderId,
    nome: name,
    telefone: phone,
    endereco: address,
    observacoes: notes,
    items: AppState.cart,
    total: AppState.cart.reduce((sum, item) => sum + item.total, 0),
    data: new Date().toISOString(),
    status: "pendente",
  };

  // Salvar pedido no localStorage
  saveOrder(order);

  return order;
}

function generateOrderId() {
  return "SAV" + Date.now().toString().slice(-8);
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");
  orders.push(order);
  localStorage.setItem("saboravidaOrders", JSON.stringify(orders));
}

function sendToWhatsApp(order) {
  const whatsappNumber = "5579981468281"; // Substituir pelo número real

  let message = `🍰 *NOVO PEDIDO - SABOR À VIDA* 🍰\n\n`;
  message += `📋 *Pedido:* ${order.id}\n`;
  message += `👤 *Nome:* ${order.nome}\n`;
  message += `📱 *Telefone:* ${order.telefone}\n`;
  message += `📍 *Endereço:* ${order.endereco}\n\n`;
  message += `🛒 *Itens:*\n`;

  order.items.forEach((item) => {
    message += `\n• ${item.quantidade}x ${item.nome}\n`;
    message += `  Massa: ${formatOption(item.massa)}\n`;
    message += `  Cobertura: ${formatOption(item.cobertura)}\n`;
    message += `  Acompanhamento: ${formatOption(item.acompanhamento)}\n`;
    if (item.coberturaExtra) message += `  ➕ Cobertura Extra\n`;
    message += `  Valor: ${formatCurrency(item.total)}\n`;
  });

  message += `\n💰 *TOTAL: ${formatCurrency(order.total)}*\n\n`;

  if (order.observacoes) {
    message += `📝 *Observações:* ${order.observacoes}\n\n`;
  }

  message += `_Para rastrear seu pedido, use seu telefone: ${order.telefone}_`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

// ============================================
// UTILIDADES
// ============================================

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatOption(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function setupPhoneMasks() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d+)/, "($1) $2");
      }

      e.target.value = value;
    });
  });
}

// Filtrar produtos por categoria
function filterCategory(category) {
  // Preferir mostrar/ocultar blocos de categoria completos quando presentes
  const sections = document.querySelectorAll(".category-section");
  if (sections.length) {
    sections.forEach((sec) => {
      const secCat = sec.getAttribute("data-category") || "";
      if (category === "all" || secCat === category) sec.style.display = "";
      else sec.style.display = "none";
    });
  } else {
    // Fallback: filtrar por cards individuais
    const cards = document.querySelectorAll(".produto-card");
    cards.forEach((card) => {
      const cat = card.getAttribute("data-category") || "bolos";
      if (category === "all" || cat === category) card.style.display = "";
      else card.style.display = "none";
    });
  }

  // Reaplicar animações em visíveis
  animateOnScroll();
}

window.filterCategory = filterCategory;

// Atualiza o texto da badge de categoria
function updateCategoryBadge(category) {
  const badge = document.getElementById("categoryBadge");
  if (!badge) return;
  const map = {
    all: "Todos os Produtos",
    bolos: "Bolos",
    panetones: "Panetones",
    tortas: "Tortas",
  };
  badge.textContent = map[category] || "Produtos";
}

// Chamar updateCategoryBadge dentro do fluxo de filtro
const _origFilterCategory = filterCategory;
filterCategory = function (category) {
  _origFilterCategory(category);
  updateCategoryBadge(category);
};
window.updateCategoryBadge = updateCategoryBadge;

function showToast(title, message, type = "info") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Expor funções globais
window.openCustomizationModal = openCustomizationModal;
window.closeCustomizationModal = closeCustomizationModal;
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.scrollToSection = scrollToSection;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.updateCartItemQty = updateCartItemQty;
window.removeCartItem = removeCartItem;
// Expor utilitários para outros scripts (ex: admin.js)
window.formatCurrency = formatCurrency;
window.formatOption = formatOption;
window.showToast = showToast;
