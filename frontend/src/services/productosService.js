export async function fetchProductos() {
  try {
    const response = await fetch("http://localhost:8000/api/productos"); // ajusta la URL si usas Laravel
    if (!response.ok) throw new Error("Error al cargar productos");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchProductos:", error);
    return [];
  }
}

export async function fetchProductoById(id) {
  const res = await fetch(`http://localhost:8000/api/productos/${id}`);
  if (!res.ok) throw new Error("Error al cargar producto");
  return res.json();
}
