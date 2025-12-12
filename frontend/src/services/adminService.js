// src/services/adminService.js
import { Users, Package, ShoppingBag, TrendingUp } from "lucide-react";

const API_BASE = "https://frutalux.duckdns.org/api";

const STATS_CONFIG = [
  { titulo: "Usuarios Totales", key: "usuarios", icon: Users, color: "blue" },
  { titulo: "Productos Activos", key: "productos", icon: Package, color: "green" },
  { titulo: "Pedidos del Mes", key: "pedidos", icon: ShoppingBag, color: "purple" },
  { titulo: "Ingresos Mensuales", key: "ingresos", icon: TrendingUp, color: "orange" }
];

// ================================================
// UTILIDADES
// ================================================

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  return {
    "Accept": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no válida: " + text);
  }
}

async function fetchAPI(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: getAuthHeaders()
  });
  
  const json = await safeJson(res);
  
  if (!res.ok) {
    throw new Error(json.message || `Error al obtener ${endpoint}`);
  }
  
  return json;
}

// ================================================
// FUNCIONES DE FETCH BÁSICAS
// ================================================

async function getUsuarios() {
  return await fetchAPI("/usuarios");
}

async function getProductos() {
  return await fetchAPI("/productos");
}

async function getPedidos() {
  return await fetchAPI("/pedidos");
}

// ================================================
// CÁLCULOS DE ESTADÍSTICAS
// ================================================

function calcularUsuariosTotales(usuarios) {
  return usuarios.length;
}

function calcularProductosActivos(productos) {
  return productos.filter(p => p.stock_kg > 0).length;
}

function calcularPedidosDelMes(pedidos) {
  const mesActual = new Date().getMonth();
  return pedidos.filter(p => new Date(p.created_at).getMonth() === mesActual).length;
}

function calcularIngresosDelMes(pedidos) {
  const mesActual = new Date().getMonth();
  const ingresos = pedidos
    .filter(p => new Date(p.created_at).getMonth() === mesActual)
    .reduce((acc, p) => acc + parseFloat(p.total || 0), 0);
  
  return ingresos.toFixed(2) + " €";
}

function construirStats(usuarios, productos, pedidos) {
  const valores = {
    usuarios: calcularUsuariosTotales(usuarios),
    productos: calcularProductosActivos(productos),
    pedidos: calcularPedidosDelMes(pedidos),
    ingresos: calcularIngresosDelMes(pedidos)
  };

  return STATS_CONFIG.map(config => ({
    titulo: config.titulo,
    valor: valores[config.key],
    icon: config.icon,
    color: config.color
  }));
}

// ================================================
// FUNCIONES PÚBLICAS
// ================================================

export async function getStatsAdmin() {
  const [usuarios, productos, pedidos] = await Promise.all([
    getUsuarios(),
    getProductos(),
    getPedidos()
  ]);

  return construirStats(usuarios, productos, pedidos);
}

export async function getPedidosRecientes() {
  const pedidos = await getPedidos();
  
  return pedidos
    .slice(0, 10)
    .map(transformarPedido);
}

// ================================================
// TRANSFORMADORES
// ================================================

function transformarPedido(pedido) {
  return {
    id: pedido.id,
    numero: pedido.numero || `PED-${pedido.id}`,
    cliente: pedido.usuario?.nombre || "Desconocido",
    fecha: new Date(pedido.created_at).toLocaleDateString(),
    tipo: pedido.tipo || "Normal",
    estado: pedido.estado || "Pendiente",
    total: pedido.total + " €"
  };
}
