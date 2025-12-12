<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\ImagenProducto;
use Illuminate\Support\Facades\Storage;

class ProductoImagenController extends Controller
{
 	public function store(Request $request, Producto $producto)
    	{
        $request->validate([
            'imagen' => 'required|image|mimes:jpg,jpeg,png|max:10240', // Aumenté a 10MB
            'es_principal' => 'nullable|boolean',
            'orden' => 'nullable|integer',
        ]);

        $file = $request->file('imagen');
        $nombreArchivo = time() . '-' . $producto->slug . '.' . $file->getClientOriginalExtension();
        
        $path = public_path('img/productos');
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }
        
        $file->move($path, $nombreArchivo);
        
        $urlImagen = "/img/productos/{$nombreArchivo}";
        
        $imagen = ImagenProducto::create([
            'producto_id'   => $producto->id,
            'nombre_imagen' => $nombreArchivo,
            'url_imagen'    => $urlImagen,
            'es_principal'  => $request->input('es_principal', false),
            'orden'         => $request->input('orden', 0),
        ]);
        
        return response()->json($imagen, 201);
    }

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
