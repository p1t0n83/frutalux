<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\ImagenProducto;
use Illuminate\Support\Facades\Storage;

class ProductoImagenController extends Controller
{
    // Subir nueva imagen
    public function store(Request $request, Producto $producto)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'es_principal' => 'nullable|boolean',
            'orden' => 'nullable|integer',
        ]);

        // Guardar archivo en storage/app/public/imagenes
        $path = $request->file('imagen')->store('imagenes', 'public');
        $nombreArchivo = basename($path);
        $urlCompleta = asset('storage/imagenes/' . $nombreArchivo);

        // Crear registro en la base de datos
        $imagen = ImagenProducto::create([
            'producto_id'   => $producto->id,
            'nombre_imagen' => $nombreArchivo,   // 👈 solo el nombre
            'url_imagen'    => $urlCompleta,     // 👈 la URL completa
            'es_principal'  => $request->input('es_principal', false),
            'orden'         => $request->input('orden', 0),
        ]);

        return response()->json($imagen, 201);
    }

    // Borrar imagen
    public function destroy(Producto $producto, ImagenProducto $imagen)
    {
        if ($imagen->producto_id !== $producto->id) {
            return response()->json(['message' => 'Imagen no pertenece al producto'], 400);
        }

        // Borrar archivo físico usando nombre_imagen
        Storage::disk('public')->delete('imagenes/' . $imagen->nombre_imagen);

        $imagen->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente']);
    }
}
