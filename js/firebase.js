// js/firebase.js - módulo ES usando Firebase v9+ (CDN imports)
// Inicializa Firebase com o firebaseConfig fornecido e expõe uma API

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  orderBy,
  where,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  runTransaction,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Config fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyDzgL_AZcFVQKNQQERnpBYTBr0efTAhGWc",
  authDomain: "sabor-a-vida-b3309.firebaseapp.com",
  projectId: "sabor-a-vida-b3309",
  storageBucket: "sabor-a-vida-b3309.firebasestorage.app",
  messagingSenderId: "375247092420",
  appId: "1:375247092420:web:c85ec15b13586ff6176791",
  measurementId: "G-9EY6ZG19JW",
};

// Inicializar
const app = initializeApp(firebaseConfig);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  /* analytics may fail in some contexts */
}
const db = getFirestore(app);
const auth = getAuth(app);

// -----------------------------------------
// Firestore helpers
// -----------------------------------------

async function saveOrderToFirestore(order) {
  try {
    const data = Object.assign({}, order);
    if (!data.createdAt) data.createdAt = serverTimestamp();
    data.updatedAt = serverTimestamp();
    await setDoc(doc(db, "orders", order.id), data, { merge: true });
    console.log("Pedido salvo no Firestore:", order.id);
    return true;
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    return false;
  }
}

async function getAllOrdersFromFirestore() {
  try {
    const q = query(collection(db, "orders"), orderBy("data", "desc"));
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((d) => d.data());
    return orders;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
}

async function getOrdersByPhoneFromFirestore(phone) {
  try {
    const cleanPhone = phone.replace(/\D/g, "");
    const q = query(
      collection(db, "orders"),
      where("telefone", ">=", cleanPhone),
      where("telefone", "<=", cleanPhone + "\uf8ff")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data());
  } catch (error) {
    console.error("Erro ao buscar pedidos por telefone:", error);
    return [];
  }
}

async function updateOrderStatusInFirestore(orderId, newStatus) {
  try {
    const ref = doc(db, "orders", orderId);
    await updateDoc(ref, { status: newStatus, updatedAt: serverTimestamp() });
    console.log("Status atualizado:", orderId, newStatus);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: error.message || String(error) };
  }
}

// Gerar ID sequencial usando transação em contador 'counters/orders'
async function generateOrderIdFirestore() {
  const counterRef = doc(db, "counters", "orders");
  try {
    const seq = await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      if (!snap.exists()) {
        tx.set(counterRef, { seq: 1 });
        return 1;
      }
      const current = snap.data().seq || 0;
      const next = current + 1;
      tx.update(counterRef, { seq: next });
      return next;
    });

    return `SAV${seq.toString().padStart(2, "0")}`;
  } catch (error) {
    console.error("Erro ao gerar ID sequencial:", error);
    throw error;
  }
}

// Subscrição em tempo real de pedidos — retorna função de unsubscribe
function subscribeOrdersRealtime(onChange, onError) {
  const q = query(collection(db, "orders"), orderBy("data", "desc"));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => d.data());
      if (typeof onChange === "function") onChange(orders);
    },
    (err) => {
      console.error("Erro no snapshot de pedidos:", err);
      if (typeof onError === "function") onError(err);
    }
  );
  return unsub;
}

async function deleteOrderFromFirestore(orderId) {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    console.log("Pedido deletado:", orderId);
    return true;
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    return false;
  }
}

// -----------------------------------------
// Auth helpers (minimal, email/password)
// -----------------------------------------

async function loginAdmin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    localStorage.setItem("adminLoggedIn", "true");
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Erro no login:", error);
    return { success: false, error: error.message };
  }
}

async function logoutAdmin() {
  try {
    await signOut(auth);
    localStorage.removeItem("adminLoggedIn");
    return true;
  } catch (error) {
    console.error("Erro no logout:", error);
    return false;
  }
}

function isAdminLoggedIn() {
  return localStorage.getItem("adminLoggedIn") === "true";
}

onAuthStateChanged(auth, (user) => {
  if (user) console.log("Admin logado (firebase):", user.email);
});

// -----------------------------------------
// Migration helpers
// -----------------------------------------

async function migrateLocalStorageToFirestore() {
  try {
    const localOrders = JSON.parse(
      localStorage.getItem("saboravidaOrders") || "[]"
    );
    for (const order of localOrders) {
      await saveOrderToFirestore(order);
    }
    const localCart = JSON.parse(
      localStorage.getItem("saboravidaCart") || "[]"
    );
    if (localCart.length > 0) {
      await setDoc(doc(db, "temp", "cart"), { items: localCart });
    }
    console.log("Migração concluída!");
    return true;
  } catch (error) {
    console.error("Erro na migração:", error);
    return false;
  }
}

async function importExampleData() {
  try {
    const resp = await fetch("DADOS_EXEMPLO.json");
    const data = await resp.json();
    for (const order of data.pedidos_exemplo || []) {
      await saveOrderToFirestore(order);
    }
    console.log("Dados de exemplo importados!");
    return true;
  } catch (error) {
    console.error("Erro ao importar dados:", error);
    return false;
  }
}

// Exportar API global equivalente ao antigo `FirebaseDB`
window.FirebaseDB = {
  saveOrder: saveOrderToFirestore,
  getAllOrders: getAllOrdersFromFirestore,
  getOrdersByPhone: getOrdersByPhoneFromFirestore,
  updateOrderStatus: updateOrderStatusInFirestore,
  generateOrderId: generateOrderIdFirestore,
  subscribeOrders: subscribeOrdersRealtime,
  deleteOrder: deleteOrderFromFirestore,
  loginAdmin,
  logoutAdmin,
  isAdminLoggedIn,
  migrateData: migrateLocalStorageToFirestore,
  importExampleData,
};

console.log("Firebase module initialized");
