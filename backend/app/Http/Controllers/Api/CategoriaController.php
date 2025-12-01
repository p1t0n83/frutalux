<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        return Categoria::with('productos')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:categorias,slug',
            'descripcion' => 'nullable|string',
        ]);

        $categoria = Categoria::create($validated);
        return response()->json($categoria, 201);
    }

    public function show($id)
    {
        return Categoria::with('productos')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update($request->all());
        return response()->json($categoria);
    }

    public function destroy($id)
    {
        Categoria::destroy($id);
        return response()->json(null, 204);
    }
}
