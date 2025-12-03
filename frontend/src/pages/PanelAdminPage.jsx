import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Users, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { getStatsAdmin, getPedidosRecientes } from "../services/adminService";
import "../styles/PanelAdmin.css";

/* ===== Componente auxiliar: tarjeta de estadísticas ===== */
function StatCard({ titulo, valor, Icon, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="stat-label">{titulo}</p>
      <p className="stat-value">{valor}</p>
    </div>
  );
}

/* ===== Componente auxiliar: accesos rápidos ===== */
function QuickCard({ to, Icon, title, text }) {
  return (
    <Link to={createPageUrl(to)}>
      <div className="quick-card">
        <div className="quick-header">
          <Icon className="quick-icon" />
          <ArrowRight className="quick-arrow" />
        </div>
        <h3 className="quick-title">{title}</h3>
        <p className="quick-text">{text}</p>
      </div>
    </Link>
  );
}

/* ===== Componente auxiliar: fila de pedido ===== */
function PedidoRow({ pedido }) {
  return (
    <tr key={pedido.id}>
      <td>
        <Link to={createPageUrl("DetallePedidoAdmin")} className="pedido-link">
          {pedido.numero}
        </Link>
      </td>
      <td>{pedido.cliente}</td>
      <td>{pedido.fecha}</td>
      <td>
        <span className="pedido-tipo">{pedido.tipo}</span>
      </td>
      <td>
        <span className={`pedido-estado ${pedido.estado.toLowerCase()}`}>
          {pedido.estado}
        </span>
      </td>
      <td className="pedido-total">{pedido.total}</td>
    </tr>
  );
}

export default function PanelAdmin() {
  const [stats, setStats] = useState([]);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [statsData, pedidosData] = await Promise.all([
          getStatsAdmin(),
          getPedidosRecientes()
        ]);
        setStats(statsData);
        setPedidosRecientes(pedidosData);
      } catch (err) {
        setError("Error al cargar datos del panel");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) return <p className="loading">Cargando panel...</p>;
  if (error) return <p className="error-popup">{error}</p>;

  return (
    <div className="panel-container">
      <div className="panel-wrapper">
        <h1 className="panel-title">Panel de Administración</h1>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <StatCard
              key={stat.titulo}
              titulo={stat.titulo}
              valor={stat.valor}
              Icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Accesos Rápidos */}
        <div className="quick-grid">
          <QuickCard
            to="Gestion-Usuarios"
            Icon={Users}
            title="Gestionar Usuarios"
            text="Ver, editar y administrar cuentas de usuarios"
          />
          <QuickCard
            to="Gestion-Productos"
            Icon={Package}
            title="Gestionar Productos"
            text="Añadir, editar y controlar el catálogo"
          />
          <QuickCard
            to="Gestion-Pedidos"
            Icon={ShoppingBag}
            title="Gestionar Pedidos"
            text="Seguimiento y actualización de pedidos"
          />
        </div>

        {/* Actividad Reciente */}
        <div className="pedidos-card">
          <h2 className="pedidos-title">Pedidos Recientes</h2>
          <div className="pedidos-table-wrapper">
            <table className="pedidos-table">
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidosRecientes.map((pedido) => (
                  <PedidoRow key={pedido.id} pedido={pedido} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
