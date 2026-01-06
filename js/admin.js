/* ============================================
   ADMIN PANEL - SABOR À VIDA
   ============================================ */

// Estado do Admin
const AdminState = {
  currentView: "dashboard",
  currentFilter: "todos",
  charts: {},
  isLoggedIn: false,
};

// Credenciais (em produção, usar autenticação real)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "sabor123",
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  setupAdminListeners();
});

function checkLogin() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  if (isLoggedIn) {
    showDashboard();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("adminDashboard").style.display = "none";
}

function showDashboard() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("adminDashboard").style.display = "flex";
  AdminState.isLoggedIn = true;
  initDashboard();
}

function setupAdminListeners() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const view = item.getAttribute("data-view");
      switchView(view);
    });
  });
}

// Utilitário: converte vários formatos de timestamp para ms desde epoch
function tsToMs(val) {
  if (!val) return NaN;
  if (val instanceof Date) return val.getTime();
  if (typeof val === "string") return Date.parse(val);
  if (val && typeof val === "object") {
    if (typeof val.toDate === "function") return val.toDate().getTime();
    if (val.seconds) return val.seconds * 1000;
  }
  return NaN;
}

// Mescla pedidos remotos com locais escolhendo a versão mais recente por updatedAt/data
function mergeRemoteWithLocal(remoteOrders) {
  const localOrders = JSON.parse(
    localStorage.getItem("saboravidaOrders") || "[]"
  );
  const localMap = new Map(localOrders.map((o) => [o.id, o]));
  const merged = [];

  remoteOrders.forEach((ro) => {
    const lo = localMap.get(ro.id);
    if (!lo) {
      merged.push(ro);
    } else {
      const roTime = tsToMs(ro.updatedAt) || tsToMs(ro.data);
      const loTime = tsToMs(lo.updatedAt) || tsToMs(lo.data);
      if (!isNaN(roTime) && !isNaN(loTime)) {
        merged.push(roTime >= loTime ? ro : lo);
      } else {
        merged.push(ro);
      }
      localMap.delete(ro.id);
    }
  });

  // adicionar pedidos locais que não existem no remoto
  for (const remaining of localMap.values()) merged.push(remaining);
  return merged;
}

// ============================================
// LOGIN
// ============================================

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    if (window.FirebaseDB && FirebaseDB.loginAdmin) {
      const resp = await FirebaseDB.loginAdmin(email, password);
      if (resp && resp.success) {
        localStorage.setItem("adminLoggedIn", "true");
        showDashboard();
        showToast("Bem-vindo!", "Login realizado com sucesso", "success");
      } else {
        showToast("Erro", resp.error || "Usuário ou senha incorretos", "error");
      }
    } else {
      // Fallback local check if Firebase não estiver disponível
      if (
        email === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem("adminLoggedIn", "true");
        showDashboard();
        showToast("Bem-vindo!", "Login realizado com sucesso", "success");
      } else {
        showToast(
          "Erro",
          "Integração do Firebase indisponível e credenciais inválidas",
          "error"
        );
      }
    }
  } catch (err) {
    console.error("Erro no login admin:", err);
    showToast("Erro", "Falha ao autenticar", "error");
  }
});
function switchView(viewName) {
  // Atualizar nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  document.querySelector(`[data-view="${viewName}"]`)?.classList.add("active");

  // Atualizar views
  document.querySelectorAll(".admin-view").forEach((view) => {
    view.classList.remove("active");
  });
  document.getElementById(`${viewName}View`)?.classList.add("active");

  // Atualizar título
  const titles = {
    dashboard: "Dashboard",
    pedidos: "Gerenciar Pedidos",
    financeiro: "Financeiro",
    produtos: "Produtos",
    configuracoes: "Configurações",
  };
  document.getElementById("pageTitle").textContent =
    titles[viewName] || "Dashboard";

  AdminState.currentView = viewName;

  // Carregar dados específicos da view
  loadViewData(viewName);
}

function loadViewData(viewName) {
  switch (viewName) {
    case "dashboard":
      loadDashboardData();
      break;
    case "pedidos":
      loadPedidos();
      break;
    case "financeiro":
      loadFinancialData();
      break;
    case "produtos":
      loadProductsData();
      break;
  }
}

// ============================================
// DASHBOARD
// ============================================

function initDashboard() {
  // Se houver integração Firebase, sincronizar pedidos remotos antes de carregar o dashboard
  if (window.FirebaseDB && FirebaseDB.getAllOrders) {
    FirebaseDB.getAllOrders()
      .then((remoteOrders) => {
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          const merged = mergeRemoteWithLocal(remoteOrders);
          localStorage.setItem("saboravidaOrders", JSON.stringify(merged));
          console.log("Pedidos remotos carregados e mesclados:", merged.length);
        } else {
          console.log(
            "Nenhum pedido remoto retornado — mantendo dados locais."
          );
        }
        loadDashboardData();
        createCharts();
      })
      .catch((err) => {
        console.error("Erro ao buscar pedidos remotos:", err);
        loadDashboardData();
        createCharts();
      });
    // Também inscrever em atualizações em tempo real para refletir exclusões/alterações feitas diretamente no console
    if (window.FirebaseDB && FirebaseDB.subscribeOrders) {
      try {
        const unsubscribe = FirebaseDB.subscribeOrders((orders) => {
          try {
            const merged = mergeRemoteWithLocal(orders);
            localStorage.setItem("saboravidaOrders", JSON.stringify(merged));
            loadDashboardData();
            if (AdminState.currentView === "pedidos")
              loadPedidos(AdminState.currentFilter);
            console.log(
              "Pedidos atualizados (realtime) mesclados:",
              merged.length
            );
          } catch (e) {
            // fallback: se algo falhar, aplicar os dados remotos brutos
            console.error("Erro ao mesclar orders realtime:", e);
            localStorage.setItem("saboravidaOrders", JSON.stringify(orders));
            loadDashboardData();
            if (AdminState.currentView === "pedidos")
              loadPedidos(AdminState.currentFilter);
          }
        });
        AdminState.unsubscribeRealtime = unsubscribe;
      } catch (err) {
        console.error("Erro ao subscrever pedidos realtime:", err);
      }
    }
    return;
  }

  loadDashboardData();
  createCharts();
}

function loadDashboardData() {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");

  // Total de vendas
  const totalVendas = orders.reduce((sum, order) => sum + order.total, 0);
  const totalVendasEl = document.getElementById("totalVendas");
  if (totalVendasEl) totalVendasEl.textContent = formatCurrency(totalVendas);

  // Total de pedidos
  const totalPedidosEl = document.getElementById("totalPedidos");
  if (totalPedidosEl) totalPedidosEl.textContent = orders.length;

  // Pedidos hoje
  const hoje = new Date().toDateString();
  const pedidosHoje = orders.filter((order) => {
    return new Date(order.data).toDateString() === hoje;
  }).length;
  const pedidosHojeEl = document.getElementById("pedidosHoje");
  if (pedidosHojeEl) pedidosHojeEl.textContent = pedidosHoje;

  // Ticket médio
  const ticketMedio = orders.length > 0 ? totalVendas / orders.length : 0;
  const ticketMedioEl = document.getElementById("ticketMedio");
  if (ticketMedioEl) ticketMedioEl.textContent = formatCurrency(ticketMedio);

  // Badge de pedidos pendentes
  const pedidosPendentes = orders.filter(
    (o) => o.status === "pendente" || o.status === "recebido"
  ).length;
  const pedidosBadgeEl = document.getElementById("pedidosBadge");
  if (pedidosBadgeEl) pedidosBadgeEl.textContent = pedidosPendentes;

  // Pedidos recentes
  loadRecentOrders(orders);
}

function loadRecentOrders(orders) {
  const recentList = document.getElementById("recentOrdersList");
  const recent = orders.slice(-5).reverse();

  if (recent.length === 0) {
    recentList.innerHTML =
      '<p style="text-align: center; color: var(--gray); padding: 2rem;">Nenhum pedido registrado</p>';
    return;
  }

  let html = "";
  recent.forEach((order) => {
    html += `
            <div class="order-card" onclick="showOrderDetail('${order.id}')">
                <div class="order-info">
                    <h4>${order.id}</h4>
                    <p>${order.nome} - ${formatCurrency(order.total)}</p>
                </div>
                <span class="order-status-badge ${order.status}">
                    ${getStatusText(order.status)}
                </span>
            </div>
        `;
  });

  recentList.innerHTML = html;
}

function createCharts() {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");

  // Sales Chart
  createSalesChart(orders);

  // Products Chart
  createProductsChart(orders);
}

function createSalesChart(orders) {
  const ctx = document.getElementById("salesChart");
  if (!ctx) return;

  // Dados dos últimos 7 dias
  const labels = [];
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(
      date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    );

    const dayOrders = orders.filter((order) => {
      const orderDate = new Date(order.data);
      return orderDate.toDateString() === date.toDateString();
    });

    const dayTotal = dayOrders.reduce((sum, order) => sum + order.total, 0);
    data.push(dayTotal);
  }

  if (AdminState.charts.sales) {
    AdminState.charts.sales.destroy();
  }

  AdminState.charts.sales = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Vendas (R$)",
          data: data,
          borderColor: "#ff6b9d",
          backgroundColor: "rgba(255, 107, 157, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "R$ " + value.toFixed(0);
            },
          },
        },
      },
    },
  });
}

function createProductsChart(orders) {
  const ctx = document.getElementById("productsChart");
  if (!ctx) return;

  // Contar produtos
  const productCounts = {
    "Mini Bolo Vulcão": 0,
    "Bolinho Vulcão": 0,
    "Bolo Vulcão Grande": 0,
  };

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (productCounts.hasOwnProperty(item.nome)) {
        productCounts[item.nome] += item.quantidade;
      }
    });
  });

  if (AdminState.charts.products) {
    AdminState.charts.products.destroy();
  }

  AdminState.charts.products = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(productCounts),
      datasets: [
        {
          data: Object.values(productCounts),
          backgroundColor: ["#ff6b9d", "#a05cff", "#ffd93d"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// ============================================
// PEDIDOS
// ============================================

function loadPedidos(filter = "todos") {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");
  const pedidosList = document.getElementById("pedidosList");

  let filteredOrders = orders;
  if (filter !== "todos") {
    filteredOrders = orders.filter((o) => o.status === filter);
  }

  if (filteredOrders.length === 0) {
    pedidosList.innerHTML =
      '<p style="text-align: center; color: var(--gray); padding: 3rem;">Nenhum pedido encontrado</p>';
    return;
  }

  let html = "";
  filteredOrders.reverse().forEach((order) => {
    html += `
            <div class="pedido-card">
                <div class="pedido-header">
                    <div>
                        <h3 class="pedido-id">Pedido ${order.id}</h3>
                        <p class="pedido-date">${formatDate(order.data)}</p>
                    </div>
                    <span class="order-status-badge ${order.status}">
                        ${getStatusText(order.status)}
                    </span>
                </div>
                
                <div class="pedido-body">
                    <div class="pedido-details">
                        <p><i class="fas fa-user"></i> <strong>${
                          order.nome
                        }</strong></p>
                        <p><i class="fas fa-phone"></i> ${order.telefone}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${
                          order.endereco
                        }</p>
                        ${
                          order.observacoes
                            ? `<p><i class="fas fa-comment"></i> ${order.observacoes}</p>`
                            : ""
                        }
                    </div>
                    
                    <div class="pedido-items">
                        <h4>Itens do Pedido</h4>
                        ${order.items
                          .map(
                            (item) => `
                            <div class="pedido-item">
                                ${item.quantidade}x ${
                              item.nome
                            } - ${formatCurrency(item.total)}
                                <div class="pedido-item-opts" style="font-size:0.95rem; color:var(--gray); margin-top:6px;">
                                    Massa: ${formatOption(item.massa)}
                                    &nbsp;|&nbsp; Cobertura: ${formatOption(
                                      item.cobertura
                                    )}
                                    ${
                                      item.acompanhamento
                                        ? `&nbsp;|&nbsp; Acompanhamento: ${formatOption(
                                            item.acompanhamento
                                          )}`
                                        : ""
                                    }
                                    ${
                                      item.coberturaExtra
                                        ? `&nbsp;|&nbsp; Cobertura Extra`
                                        : ""
                                    }
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                        <div class="pedido-total">Total: ${formatCurrency(
                          order.total
                        )}</div>
                    </div>
                </div>
                
                <div class="pedido-actions">
                    ${getOrderActions(order)}
                </div>
            </div>
        `;
  });

  pedidosList.innerHTML = html;
}

function getOrderActions(order) {
  const actions = {
    pendente: `
            <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'confirmado')">
                <i class="fas fa-check"></i> Confirmar
            </button>
            <button class="btn btn-danger" onclick="cancelOrder('${order.id}')">
                <i class="fas fa-times"></i> Cancelar
            </button>
        `,
    recebido: `
            <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'confirmado')">
                <i class="fas fa-check"></i> Confirmar
            </button>
        `,
    confirmado: `
            <button class="btn btn-primary" onclick="updateOrderStatus('${order.id}', 'preparando')">
                <i class="fas fa-fire"></i> Iniciar Preparo
            </button>
        `,
    preparando: `
            <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'pronto')">
                <i class="fas fa-check"></i> Marcar como Pronto
            </button>
        `,
    pronto: `
            <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'entregue')">
                <i class="fas fa-truck"></i> Marcar como Entregue
            </button>
        `,
    entregue: `
            <span style="color: var(--success); font-weight: 600;">
                <i class="fas fa-check-circle"></i> Pedido Concluído
            </span>
        `,
  };

  return actions[order.status] || "";
}

function filterOrders(status) {
  // Atualizar tabs
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelector(`[data-status="${status}"]`)?.classList.add("active");

  AdminState.currentFilter = status;
  loadPedidos(status);
}

async function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");
  const order = orders.find((o) => o.id === orderId);

  if (!order) return;

  // Tentar persistir remotamente quando disponível
  if (window.FirebaseDB && FirebaseDB.updateOrderStatus) {
    try {
      const ok = await FirebaseDB.updateOrderStatus(orderId, newStatus);
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem("saboravidaOrders", JSON.stringify(orders));

      if (ok) {
        showToast(
          "Atualizado!",
          `Pedido ${orderId} atualizado para: ${getStatusText(newStatus)}`,
          "success"
        );
      } else {
        showToast(
          "Atualizado localmente",
          `Falha ao persistir no servidor. Status atualizado localmente para: ${getStatusText(
            newStatus
          )}`,
          "warning"
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar status remoto:", err);
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem("saboravidaOrders", JSON.stringify(orders));
      showToast(
        "Atualizado localmente",
        `Falha ao atualizar remoto. Status atualizado localmente para: ${getStatusText(
          newStatus
        )}`,
        "warning"
      );
    }
  } else {
    // Só local
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem("saboravidaOrders", JSON.stringify(orders));
    showToast(
      "Atualizado!",
      `Pedido ${orderId} atualizado para: ${getStatusText(newStatus)}`,
      "success"
    );
  }

  loadPedidos(AdminState.currentFilter);
  loadDashboardData();
}

function cancelOrder(orderId) {
  if (confirm("Tem certeza que deseja cancelar este pedido?")) {
    const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");
    const filteredOrders = orders.filter((o) => o.id !== orderId);
    localStorage.setItem("saboravidaOrders", JSON.stringify(filteredOrders));

    showToast("Cancelado", "Pedido cancelado com sucesso", "info");
    loadPedidos(AdminState.currentFilter);
    loadDashboardData();
  }
}

function showOrderDetail(orderId) {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");
  const order = orders.find((o) => o.id === orderId);

  if (!order) return;

  const modal = document.getElementById("orderDetailModal");
  const content = document.getElementById("orderDetailContent");

  content.innerHTML = `
        <div class="modal-header">
            <h2>Detalhes do Pedido ${order.id}</h2>
            <p>${formatDate(order.data)}</p>
        </div>
        <div class="modal-body">
            <h3>Informações do Cliente</h3>
            <p><strong>Nome:</strong> ${order.nome}</p>
            <p><strong>Telefone:</strong> ${order.telefone}</p>
            <p><strong>Endereço:</strong> ${order.endereco}</p>
            ${
              order.observacoes
                ? `<p><strong>Observações:</strong> ${order.observacoes}</p>`
                : ""
            }
            
            <h3 style="margin-top: 2rem;">Itens do Pedido</h3>
            ${order.items
              .map(
                (item) => `
                <div style="background: var(--gray-light); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    <strong>${item.quantidade}x ${item.nome}</strong><br>
                    Massa: ${formatOption(item.massa)}<br>
                    Cobertura: ${formatOption(item.cobertura)}<br>
                    Acompanhamento: ${formatOption(item.acompanhamento)}<br>
                    ${item.coberturaExtra ? "Cobertura Extra: Sim<br>" : ""}
                    <strong style="color: var(--primary);">Subtotal: ${formatCurrency(
                      item.total
                    )}</strong>
                </div>
            `
              )
              .join("")}
            
            <div style="background: var(--primary); color: white; padding: 1.5rem; border-radius: var(--radius-md); text-align: center; font-size: 1.5rem; font-weight: 700;">
                Total: ${formatCurrency(order.total)}
            </div>
        </div>
    `;

  modal.classList.add("active");
}

function closeOrderModal() {
  document.getElementById("orderDetailModal").classList.remove("active");
}

// Faz logout do admin: limpa estado local e encerra sessão no Firebase quando disponível
async function logout() {
  try {
    // Se houver inscrição realtime, cancelar
    if (AdminState.unsubscribeRealtime) {
      try {
        AdminState.unsubscribeRealtime();
      } catch (e) {
        console.warn("Falha ao cancelar realtime unsubscribe:", e);
      }
      AdminState.unsubscribeRealtime = null;
    }

    if (window.FirebaseDB && FirebaseDB.logoutAdmin) {
      await FirebaseDB.logoutAdmin();
    } else if (window.FirebaseDB && FirebaseDB.logout) {
      // compatibilidade por nome
      await FirebaseDB.logout();
    } else {
      localStorage.removeItem("adminLoggedIn");
    }

    AdminState.isLoggedIn = false;
    showLoginScreen();
    showToast("Sessão encerrada", "Você saiu do painel admin", "info");
  } catch (err) {
    console.error("Erro ao efetuar logout:", err);
    showToast("Erro", "Falha ao encerrar sessão", "error");
  }
}

// ============================================
// FINANCEIRO
// ============================================

function loadFinancialData() {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");

  // Calcular faturamentos
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());

  const faturamentoMensal = orders
    .filter((o) => new Date(o.data) >= inicioMes)
    .reduce((sum, o) => sum + o.total, 0);

  const faturamentoSemanal = orders
    .filter((o) => new Date(o.data) >= inicioSemana)
    .reduce((sum, o) => sum + o.total, 0);

  const faturamentoHoje = orders
    .filter((o) => new Date(o.data).toDateString() === hoje.toDateString())
    .reduce((sum, o) => sum + o.total, 0);

  document.getElementById("faturamentoMensal").textContent =
    formatCurrency(faturamentoMensal);
  document.getElementById("faturamentoSemanal").textContent =
    formatCurrency(faturamentoSemanal);
  document.getElementById("faturamentoHoje").textContent =
    formatCurrency(faturamentoHoje);

  // Criar gráfico financeiro
  createFinancialChart(orders);

  // Carregar transações
  loadTransactions(orders);
}

function createFinancialChart(orders) {
  const ctx = document.getElementById("financialChart");
  if (!ctx) return;

  // Dados dos últimos 30 dias
  const labels = [];
  const data = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(
      date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    );

    const dayOrders = orders.filter((order) => {
      const orderDate = new Date(order.data);
      return orderDate.toDateString() === date.toDateString();
    });

    const dayTotal = dayOrders.reduce((sum, order) => sum + order.total, 0);
    data.push(dayTotal);
  }

  if (AdminState.charts.financial) {
    AdminState.charts.financial.destroy();
  }

  AdminState.charts.financial = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Faturamento (R$)",
          data: data,
          backgroundColor: "rgba(255, 107, 157, 0.7)",
          borderColor: "#ff6b9d",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "R$ " + value.toFixed(0);
            },
          },
        },
      },
    },
  });
}

function loadTransactions(orders) {
  const list = document.getElementById("transactionsList");

  if (orders.length === 0) {
    list.innerHTML =
      '<p style="text-align: center; color: var(--gray); padding: 2rem;">Nenhuma transação registrada</p>';
    return;
  }

  let html = "";
  orders
    .slice(-10)
    .reverse()
    .forEach((order) => {
      html += `
            <div class="transaction-item">
                <div>
                    <strong>${order.id}</strong><br>
                    <small style="color: var(--gray);">${formatDate(
                      order.data
                    )}</small>
                </div>
                <strong style="color: var(--success);">${formatCurrency(
                  order.total
                )}</strong>
            </div>
        `;
    });

  list.innerHTML = html;
}

// ============================================
// PRODUTOS
// ============================================

function loadProductsData() {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");

  // Contar produtos
  const productCounts = {
    mini: 0,
    medio: 0,
    grande: 0,
  };

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (productCounts.hasOwnProperty(item.tamanho)) {
        productCounts[item.tamanho] += item.quantidade;
      }
    });
  });

  document.getElementById("miniBolosCount").textContent = productCounts.mini;
  document.getElementById("bolinhoCount").textContent = productCounts.medio;
  document.getElementById("boloGrandeCount").textContent = productCounts.grande;

  // Sabores mais populares
  loadPopularFlavors(orders);
}

function loadPopularFlavors(orders) {
  const flavors = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const key = `${item.massa} + ${item.cobertura}`;
      flavors[key] = (flavors[key] || 0) + item.quantidade;
    });
  });

  const sorted = Object.entries(flavors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const container = document.getElementById("flavorsChart");

  if (sorted.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--gray); padding: 2rem;">Nenhum dado disponível</p>';
    return;
  }

  let html = '<div style="display: grid; gap: 1rem;">';
  sorted.forEach(([flavor, count], index) => {
    const percentage = (count / sorted[0][1]) * 100;
    html += `
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span><strong>${index + 1}.</strong> ${formatOption(
      flavor
    )}</span>
                    <span style="color: var(--primary); font-weight: 600;">${count} pedidos</span>
                </div>
                <div style="background: var(--gray-light); height: 10px; border-radius: var(--radius-full); overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: var(--gradient-primary);"></div>
                </div>
            </div>
        `;
  });
  html += "</div>";

  container.innerHTML = html;
}

// ============================================
// UTILIDADES
// ============================================

function refreshData() {
  showToast("Atualizando...", "Recarregando dados", "info");
  loadViewData(AdminState.currentView);

  setTimeout(() => {
    showToast("Atualizado!", "Dados atualizados com sucesso", "success");
  }, 1000);
}

function exportData() {
  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");
  const dataStr = JSON.stringify(orders, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pedidos-saboravida-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();

  showToast("Exportado!", "Dados exportados com sucesso", "success");
}

async function clearAllOrders() {
  if (!confirm("ATENÇÃO: Isso vai apagar TODOS os pedidos. Tem certeza?"))
    return;
  if (!confirm("Esta ação não pode ser desfeita. Confirma?")) return;

  const orders = JSON.parse(localStorage.getItem("saboravidaOrders") || "[]");

  // Tentar remover também no Firestore quando possível
  if (window.FirebaseDB && FirebaseDB.deleteOrder) {
    try {
      for (const o of orders) {
        try {
          await FirebaseDB.deleteOrder(o.id);
        } catch (e) {
          console.warn("Falha ao deletar pedido remoto:", o.id, e);
        }
      }
      // Ao deletar remotamente, a inscrição realtime (se ativa) deverá sincronizar localStorage.
      localStorage.setItem("saboravidaOrders", "[]");
      showToast(
        "Limpo!",
        "Todos os pedidos foram removidos (remoto e local)",
        "success"
      );
      loadViewData(AdminState.currentView);
      return;
    } catch (err) {
      console.error("Erro ao limpar pedidos remotamente:", err);
      showToast(
        "Parcial",
        "Ocorreram erros ao deletar alguns pedidos remotamente",
        "warning"
      );
    }
  }

  // Fallback: apenas local
  localStorage.setItem("saboravidaOrders", "[]");
  showToast("Limpo!", "Todos os pedidos foram removidos (local)", "success");
  loadViewData(AdminState.currentView);
}

function getStatusText(status) {
  const texts = {
    pendente: "Pendente",
    recebido: "Recebido",
    confirmado: "Confirmado",
    preparando: "Em Preparação",
    pronto: "Pronto",
    entregue: "Entregue",
  };
  return texts[status] || status;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR");
}

// Expor funções globais
window.logout = logout;
window.switchView = switchView;
window.filterOrders = filterOrders;
window.updateOrderStatus = updateOrderStatus;
window.cancelOrder = cancelOrder;
window.showOrderDetail = showOrderDetail;
window.closeOrderModal = closeOrderModal;
window.refreshData = refreshData;
window.exportData = exportData;
window.clearAllOrders = clearAllOrders;
