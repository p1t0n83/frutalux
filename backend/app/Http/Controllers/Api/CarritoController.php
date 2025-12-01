<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carrito;
use Illuminate\Http\Request;

class CarritoController extends Controller
{
    public function index()
    {
        return Carrito::with('usuario','items.producto')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $carrito = Carrito::create($validated);
        return response()->json($carrito, 201);
    }

    public function show($id)
    {
        return Carrito::with('usuario','items.producto')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $carrito = Carrito::findOrFail($id);
        $carrito->update($request->all());
        return response()->json($carrito);
    }

    public function destroy($id)
    {
        Carrito::destroy($id);
        return response()->json(null, 204);
    }
}
