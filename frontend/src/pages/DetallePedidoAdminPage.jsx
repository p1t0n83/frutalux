import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer, X, User, MapPin, CreditCard, Package, Clock } from "lucide-react";
import { getPedidoById } from "../services/pedidoService";
import "../styles/DetallePedidoAdmin.css";

export default function DetallePedidoAdmin() {
  const { id } = useParams();
  const [estado, setEstado] = useState("Preparando");
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const data = await getPedidoById(id);
        setPedido(data);
        setEstado(data.estado || "Pendiente");
      } catch (err) {
        setError("Error al cargar pedido");
      }
    };
    cargarPedido();
  }, [id]);

  if (error) return <p className="error-popup">{error}</p>;
  if (!pedido) return <p>Cargando pedido...</p>;

  return (
    <div className="detalle-pedido-container">
      <div className="detalle-pedido-wrapper">
        {/* Header */}
        <div className="detalle-header">
          <div className="detalle-header-left">
            <Link to="/admin/pedidos">
              <button className="btn-back">
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
            </Link>
            <div>
              <h1 className="detalle-title">Pedido {pedido.numero}</h1>
              <p className="detalle-subtitle">Realizado el {pedido.fecha}</p>
            </div>
          </div>
          <div className="detalle-header-right">
            <button className="btn-printer">
              <Printer className="w-5 h-5" /> IMPRIMIR
            </button>
            <button className="btn-cancel">
              <X className="w-5 h-5" /> CANCELAR
            </button>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="select-estado"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Preparando">Preparando</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
        </div>

        <div className="detalle-grid">
          {/* Info Principal */}
          <div className="detalle-main">
            {/* Cliente */}
            <div className="detalle-card">
              <div className="detalle-card-header">
                <User className="icon-green" />
                <h3>Cliente</h3>
              </div>
              <div className="detalle-card-body">
                <p>{pedido.cliente?.nombre}</p>
                <p>{pedido.cliente?.email}</p>
                <p>{pedido.cliente?.telefono}</p>
              </div>
            </div>

            {/* Dirección */}
            <div className="detalle-card">
              <div className="detalle-card-header">
                <MapPin className="icon-green" />
                <h3>Dirección de Envío</h3>
              </div>
              <p>{pedido.direccion}</p>
            </div>

            {/* Productos */}
            <div className="detalle-card">
              <div className="detalle-card-header">
                <Package className="icon-green" />
                <h3>Productos del Pedido</h3>
              </div>
              <table className="detalle-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.productos?.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.nombre}</td>
                      <td>{prod.cantidad}</td>
                      <td>{prod.precio_unitario}</td>
                      <td>{prod.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pago */}
            <div className="detalle-card">
              <div className="detalle-card-header">
                <CreditCard className="icon-green" />
                <h3>Información de Pago</h3>
              </div>
              <div className="detalle-card-body">
                <p>Método: {pedido.metodo_pago}</p>
                <p>
                  Estado:{" "}
                  <span className="pill pill-green">{pedido.estado_pago}</span>
                </p>
                <p>Referencia: {pedido.referencia_pago}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detalle-sidebar">
            {/* Resumen */}
            <div className="detalle-card">
              <h3>Resumen del Pedido</h3>
              <div className="detalle-card-body">
                <p>Subtotal: {pedido.subtotal}</p>
                <p>Gastos envío: {pedido.gastos_envio}</p>
                <p className="detalle-total">Total: {pedido.total}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="detalle-card">
              <div className="detalle-card-header">
                <Clock className="icon-green" />
                <h3>Estado del Pedido</h3>
              </div>
              <div className="detalle-timeline">
                {pedido.timeline?.map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div
                      className={`timeline-dot ${
                        item.estado === "completado"
                          ? "dot-green"
                          : item.estado === "actual"
                          ? "dot-blue"
                          : "dot-gray"
                      }`}
                    ></div>
                    <div className="timeline-info">
                      <p className="timeline-date">{item.fecha}</p>
                      <p className="timeline-event">{item.evento}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
