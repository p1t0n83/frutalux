<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    public function index()
    {
        return Producto::with('categoria','imagenes','valoraciones')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:productos,slug',
            'nombre_productor' => 'nullable|string|max:255',
            'precio_kg' => 'required|numeric|min:0',
            'stock_kg' => 'required|integer|min:0',
        ]);

        $producto = Producto::create($validated);
        return response()->json($producto, 201);
    }

    public function show($id)
    {
        return Producto::with('categoria','imagenes','valoraciones')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update($request->all());
        return response()->json($producto);
    }

    public function destroy($id)
    {
        $producto = Producto::with('imagenes')->findOrFail($id);

        // ✅ Borrar imágenes físicas asociadas
        foreach ($producto->imagenes as $imagen) {
            if ($imagen->nombre_imagen) {
                Storage::disk('public')->delete('imagenes/' . $imagen->nombre_imagen);
            }
        }

        // ✅ Si usas carpetas por producto (ej: /imagenes/producto_{id})
        Storage::disk('public')->deleteDirectory('imagenes/producto_' . $producto->id);

        // ✅ Borrar el producto (esto cascada las filas de imagenes_producto)
        $producto->delete();

        return response()->json(['message' => 'Producto e imágenes eliminados'], 200);
    }
}
