const API_URL = 'http://localhost:8000/api';

export async function getCategorias() {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
      throw new Error('Error al cargar categorías');
    }
    return await response.json();
  } catch (error) {
    console.error('Error cargando categorías:', error);
    throw error;
  }
}
