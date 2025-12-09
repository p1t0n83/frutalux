import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, CreditCard } from "lucide-react";
import { getPedidos } from "../services/pedidoService";
import "../styles/GestionPedidos.css";

const ESTADOS = [
  { value: "all", label: "Todos los estados" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "Confirmado", label: "Confirmado" },
  { value: "Preparando", label: "Preparando" },
  { value: "Enviado", label: "Enviado" },
  { value: "Entregado", label: "Entregado" },
  { value: "Pagado", label: "Pagado" }
];

const obtenerClaseEstado = (estado) => {
  const estados = {
    "Entregado": "estado-entregado",
    "Enviado": "estado-enviado",
    "Preparando": "estado-preparando",
    "Confirmado": "estado-confirmado",
    "Pagado": "estado-pagado"
  };
  return estados[estado] || "estado-pendiente";
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function GestionPedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("all");
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const data = await getPedidos();
        const listaPedidos = data.data || data.pedidos || data || [];

        const pedidosNormalizados = listaPedidos.map((pedido) => ({
          id: pedido.id,
          numero: pedido.numero || pedido.numero_pedido,
          cliente: pedido.cliente || pedido.cliente_nombre || "Sin nombre",
          estado: pedido.estado === "pagado" ? "Pagado" : pedido.estado,
          fecha: formatearFecha(pedido.created_at),
          tipo: pedido.tipo || pedido.tipo_pedido,
          total: pedido.total,
          factura_url: pedido.factura_url,
        }));

        setPedidos(pedidosNormalizados);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("Error al cargar pedidos");
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, []);

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "all" || pedido.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const abrirFactura = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  if (error) {
    return <p className="error-popup">{error}</p>;
  }

  return (
    <div className="gestion-pedidos-container">
      <div className="gestion-pedidos-wrapper">
        <h1 className="gestion-title">Gestión de Pedidos</h1>

        <div className="buscador-wrapper">
          <div className="buscador-input">
            <Search className="buscador-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de pedido o cliente..."
              className="input-busqueda"
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="select-filtro"
          >
            {ESTADOS.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>

        <div className="tabla-wrapper">
          <div className="tabla-scroll">
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th className="text-right">Total</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="fila-pedido">
                    <td>
                      <Link
                        to={`/admin/pedidos/${pedido.id}`}
                        className="pedido-link"
                      >
                        {pedido.numero}
                      </Link>
                    </td>
                    <td>{pedido.cliente}</td>
                    <td>{pedido.fecha}</td>
                    <td>
                      <span className="tipo-pill">{pedido.tipo}</span>
                    </td>
                    <td className="text-right">{pedido.total}</td>
                    <td>
                      <span className={`estado-pill ${obtenerClaseEstado(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td>
                      <div className="acciones">
                        <Link to={`/admin/pedidos/${pedido.id}`}>
                          <button className="btn-ver">
                            <Eye className="w-5 h-5" />
                          </button>
                        </Link>
                        {pedido.factura_url && (
                          <button
                            className="btn-factura"
                            onClick={() => abrirFactura(pedido.factura_url)}
                          >
                            <CreditCard className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPedidos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-resultados">
                      No se encontraron pedidos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}