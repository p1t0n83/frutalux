const API_URL = 'https://frutalux.duckdns.org/api';

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
