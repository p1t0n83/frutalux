<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

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
        Producto::destroy($id);
        return response()->json(null, 204);
    }
}

