// src/services/authService.js
const API_BASE = "http://localhost:8000/api";
const TOKEN_KEY = "token";

// ================================================
// UTILIDADES
// ================================================

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no válida: " + text);
  }
}

function getBaseHeaders() {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
}

function getAuthHeaders() {
  return {
    ...getBaseHeaders(),
    "Authorization": `Bearer ${getToken()}`
  };
}

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const json = await safeJson(res);
  
  if (!res.ok) {
    throw new Error(json.message || `Error en ${endpoint}`);
  }
  
  return json;
}

// ================================================
// FUNCIONES PÚBLICAS
// ================================================

/**
 * Registro de usuario
 */
export async function registrarUsuario(data) {
  const json = await fetchAPI("/register", {
    method: "POST",
    headers: getBaseHeaders(),
    body: JSON.stringify(data)
  });
  
  setToken(json.access_token);
  return json;
}

/**
 * Login de usuario
 */
export async function loginUsuario(data) {
  const json = await fetchAPI("/login", {
    method: "POST",
    headers: getBaseHeaders(),
    body: JSON.stringify(data)
  });
  
  setToken(json.access_token);
  return json;
}

/**
 * Logout de usuario
 */
export async function logoutUsuario() {
  const json = await fetchAPI("/logout", {
    method: "POST",
    headers: getAuthHeaders()
  });
  
  removeToken();
  return json;
}

/**
 * Obtener usuario autenticado
 */
export async function getUsuario() {
  return await fetchAPI("/me", {
    method: "GET",
    headers: getAuthHeaders()
  });
}
