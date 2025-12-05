<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Valoracion;
use Illuminate\Http\Request;

class ValoracionController extends Controller
{
    public function index()
    {
        return Valoracion::with('usuario', 'producto')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'producto_id' => 'required|exists:productos,id',
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string',
        ]);

        $valoracion = Valoracion::create($validated);
        return response()->json($valoracion, 201);
    }

    public function show($id)
    {
        return Valoracion::with('usuario', 'producto')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $valoracion = Valoracion::findOrFail($id);
        $valoracion->update($request->all());
        return response()->json($valoracion);
    }

    public function destroy($id)
    {
        Valoracion::destroy($id);
        return response()->json(null, 204);
    }
}
