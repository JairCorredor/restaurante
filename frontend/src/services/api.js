// src/services/api.js
// Centraliza todas las llamadas al backend.
// Uso: import api from '../services/api';

const BASE = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error del servidor");
  return data;
}

const api = {
  // ── Auth ──────────────────────────────────────────────────
  login:  (correo, contrasena) => request("POST", "/auth/login", { correo, contrasena }),
  register: (data)             => request("POST", "/auth/register", data),
  perfil: ()                   => request("GET",  "/auth/me"),
  cambiarMiSede: (id_sede)     => request("PUT", "/auth/mi-sede", { id_sede }),

  // ── Sedes ─────────────────────────────────────────────────
  getSedes: ()                 => request("GET", "/sedes"),

  // ── Mesas ─────────────────────────────────────────────────
  getMesas:        (id_sede)    => request("GET",  id_sede ? `/mesas?id_sede=${id_sede}` : "/mesas"),
  actualizarMesa:  (id, data)   => request("PUT",  `/mesas/${id}`, data),

  // ── Pedidos ───────────────────────────────────────────────
  getPedidos:      ()           => request("GET",  "/pedidos"),
  crearPedido:     (data)       => request("POST", "/pedidos", data),
  actualizarEstado:(id, estado) => request("PUT",  `/pedidos/${id}/estado`, { estado }),

  // ── Menú ──────────────────────────────────────────────────
  getMenu:    ()   => request("GET", "/menu"),
  getReceta:  (id) => request("GET", `/menu/${id}/receta`),

  // ── Inventario ────────────────────────────────────────────
  getInventario:     ()         => request("GET", "/inventario"),
  actualizarProducto:(id, data) => request("PUT", `/inventario/${id}`, data),

  // ── Facturas ──────────────────────────────────────────────
  getFacturas:  ()     => request("GET",  "/facturas"),
  getMisFacturas: ()    => request("GET",  "/facturas/mis-facturas"),
  crearFactura: (data) => request("POST", "/facturas", data),

  // ── Reservas ──────────────────────────────────────────────
  getReservas:    ()   => request("GET",  "/reservas"),
  getMesasDisponibles: (id_sede, fecha, hora, personas=1) => {
    const q = new URLSearchParams({ id_sede, personas });
    if (fecha) q.append("fecha", fecha);
    if (hora) q.append("hora", hora);
    return request("GET", `/reservas/disponibilidad?${q.toString()}`);
  },
  crearReserva:   (data) => request("POST", "/reservas", data),
  cancelarReserva:(id) => request("PUT",  `/reservas/${id}/cancelar`),

  // ── Usuarios ──────────────────────────────────────────────
  getUsuarios:  ()     => request("GET",  "/usuarios"),
  crearUsuario: (data) => request("POST", "/usuarios", data),
  toggleActivo: (id, activo) => request("PUT", `/usuarios/${id}/activo`, { activo }),

  // ── Clientes ──────────────────────────────────────────────
  getPerfilCliente:        ()     => request("GET", "/clientes/perfil"),
  actualizarPerfilCliente: (data) => request("PUT", "/clientes/perfil", data),
  getMisReservas:          ()     => request("GET", "/reservas/mis-reservas"),
  
  // ── Alergias ──────────────────────────────────────────────
  getAlergias:           ()      => request("GET", "/alergias"),
  getMisAlergias:        ()      => request("GET", "/alergias/mis-alergias"),
  actualizarMisAlergias: (ids)   => request("PUT", "/alergias/mis-alergias", { ids }),

  // ── Encuestas ─────────────────────────────────────────────
  getMisPedidosEntregados: ()     => request("GET",  "/encuestas/pedidos-disponibles"),
  getMisEncuestas:         ()     => request("GET",  "/encuestas/mis-encuestas"),
  crearEncuesta:           (data) => request("POST", "/encuestas", data),

  // ── Reseñas ───────────────────────────────────────────────
  getMisResenas: ()     => request("GET",  "/resenas/mis-resenas"),
  crearResena:   (data) => request("POST", "/resenas", data),

  // ── Inversionistas ────────────────────────────────────────
  getResumenInversionista:   ()         => request("GET", "/inversionistas/resumen"),
  getHistorialInversionista: (meses=6)  => request("GET", `/inversionistas/historial?meses=${meses}`),
  getInversionistas:         ()         => request("GET", "/inversionistas"),
  asignarSede: (data)                   => request("POST", "/inversionistas", data),
  quitarSede:  (id_usuario, id_sede)    => request("DELETE", `/inversionistas/${id_usuario}/sede/${id_sede}`),
};

export default api;
