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
   LISTAR TODOS LOS USUARIOS
   ============================ */
export async function getUsuarios() {
  const res = await fetch(`${API_BASE}/usuarios`, {
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener usuarios");
  return json;
}

/* ============================
   OBTENER UN USUARIO POR ID
   ============================ */
export async function getUsuario(id) {
  const res = await fetch(`${API_BASE}/usuarios/${id}`, {
    headers: { "Accept": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error("Error al obtener usuario");
  return json;
}

/* ============================
   CREAR USUARIO
   ============================ */
export async function createUsuario(data) {
  const res = await fetch(`${API_BASE}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error("Error al crear usuario");
  return json;
}

/* ============================
   ACTUALIZAR USUARIO
   ============================ */
export async function updateUsuario(id, data) {
  const res = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return json;
}

/* ============================
   BORRAR USUARIO
   ============================ */
export async function deleteUsuario(id) {
  const res = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("Error al borrar usuario");
}
