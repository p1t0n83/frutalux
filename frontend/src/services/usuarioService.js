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

/**
 * Función centralizada para hacer peticiones autenticadas a la API
 */
async function apiFetchAuth(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || options.errorMessage || "Error en la petición");
  return json;
}

/**
 * Función para peticiones DELETE sin respuesta JSON
 */
async function apiFetchDelete(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!res.ok) throw new Error(options.errorMessage || "Error en la petición");
}

/* ============================
   LISTAR TODOS LOS USUARIOS
   ============================ */
export async function getUsuarios() {
  return apiFetchAuth("/usuarios", {
    errorMessage: "Error al obtener usuarios"
  });
}

/* ============================
   OBTENER UN USUARIO POR ID
   ============================ */
export async function getUsuario(id) {
  return apiFetchAuth(`/usuarios/${id}`, {
    errorMessage: "Error al obtener usuario"
  });
}

/* ============================
   CREAR USUARIO
   ============================ */
export async function createUsuario(data) {
  return apiFetchAuth("/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    errorMessage: "Error al crear usuario"
  });
}

/* ============================
   ACTUALIZAR USUARIO
   ============================ */
export async function updateUsuario(id, data) {
  return apiFetchAuth(`/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    errorMessage: "Error al actualizar usuario"
  });
}

/* ============================
   BORRAR USUARIO
   ============================ */
export async function deleteUsuario(id) {
  return apiFetchDelete(`/usuarios/${id}`, {
    errorMessage: "Error al borrar usuario"
  });
}
