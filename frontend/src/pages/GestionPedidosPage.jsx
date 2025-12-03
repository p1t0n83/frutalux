import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Eye, Edit } from "lucide-react";
import { getPedidos } from "../services/pedidoService";
import "../styles/GestionPedidos.css";

export default function GestionPedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("all");
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (err) {
        setError("Error al cargar pedidos");
      }
    };
    cargarPedidos();
  }, []);

  const filteredPedidos = pedidos.filter((p) => {
    const matchesSearch =
      p.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "all" || p.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  if (error) return <p className="error-popup">{error}</p>;

  return (
    <div className="gestion-pedidos-container">
      <div className="gestion-pedidos-wrapper">
        <h1 className="gestion-title">Gestión de Pedidos</h1>

        {/* Buscador y Filtro */}
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
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Preparando">Preparando</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        {/* Tabla */}
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
                      <span
                        className={`estado-pill ${
                          pedido.estado === "Entregado"
                            ? "estado-entregado"
                            : pedido.estado === "Enviado"
                            ? "estado-enviado"
                            : pedido.estado === "Preparando"
                            ? "estado-preparando"
                            : pedido.estado === "Confirmado"
                            ? "estado-confirmado"
                            : "estado-pendiente"
                        }`}
                      >
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
                        <button
                          className="btn-editar"
                          onClick={() => navigate(`/admin/pedidos/${pedido.id}/editar`)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
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
