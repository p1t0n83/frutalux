import { Users, Package, ShoppingBag, TrendingUp } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no válida: " + text);
  }
}

/* ============================
   USUARIOS
   ============================ */
async function getUsuarios() {
  const res = await fetch(`${API_BASE}/usuarios`, {
    headers: { "Accept": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener usuarios");
  return json;
}

/* ============================
   PRODUCTOS
   ============================ */
async function getProductos() {
  const res = await fetch(`${API_BASE}/productos`, {
    headers: { "Accept": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener productos");
  return json;
}

/* ============================
   PEDIDOS
   ============================ */
async function getPedidos() {
  const res = await fetch(`${API_BASE}/pedidos`, {
    headers: { "Accept": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener pedidos");
  return json;
}

/* ============================
   STATS ADMIN
   ============================ */
export async function getStatsAdmin() {
  const [usuarios, productos, pedidos] = await Promise.all([
    getUsuarios(),
    getProductos(),
    getPedidos()
  ]);

  const usuariosTotales = usuarios.length;
  const productosActivos = productos.filter(p => p.stock_kg > 0).length;
  const pedidosMes = pedidos.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length;
  const ingresosMes = pedidos
    .filter(p => new Date(p.created_at).getMonth() === new Date().getMonth())
    .reduce((acc, p) => acc + parseFloat(p.total), 0)
    .toFixed(2) + " €";

  return [
    { titulo: "Usuarios Totales", valor: usuariosTotales, icon: Users, color: "blue" },
    { titulo: "Productos Activos", valor: productosActivos, icon: Package, color: "green" },
    { titulo: "Pedidos del Mes", valor: pedidosMes, icon: ShoppingBag, color: "purple" },
    { titulo: "Ingresos Mensuales", valor: ingresosMes, icon: TrendingUp, color: "orange" }
  ];
}

/* ============================
   PEDIDOS RECIENTES
   ============================ */
export async function getPedidosRecientes() {
  const pedidos = await getPedidos();
  return pedidos.slice(0, 10).map(p => ({
    id: p.id,
    numero: p.numero || `PED-${p.id}`,
    cliente: p.usuario?.nombre || "Desconocido",
    fecha: new Date(p.created_at).toLocaleDateString(),
    tipo: p.tipo || "Normal",
    estado: p.estado || "Pendiente",
    total: p.total + " €"
  }));
}
