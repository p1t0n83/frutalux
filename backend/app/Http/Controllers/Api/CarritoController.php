<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carrito;
use App\Models\CarritoItem;
use Illuminate\Http\Request;

class CarritoController extends Controller
{

    public function index()
    {
        return Carrito::with('usuario', 'items.producto')->get();
    }

   
    public function show(Request $request)
    {
        $user = $request->user();

        $carrito = Carrito::firstOrCreate(
            ['user_id' => $user->id],
            ['estado' => 'activo'] 
        );

        return response()->json($carrito->load('usuario', 'items.producto'));
    }

    
    public function update(Request $request)
    {
        $user = $request->user();
        $carrito = Carrito::firstOrCreate(['user_id' => $user->id]);

        $carrito->update($request->only('estado'));

        return response()->json($carrito->load('usuario', 'items.producto'));
    }

    
    public function destroy(Request $request)
    {
        $user = $request->user();
        $carrito = Carrito::where('user_id', $user->id)->first();

        if ($carrito) {
            $carrito->delete();
        }

        return response()->json(null, 204);
    }

    // -----------------------------
    // Métodos para items del carrito
    // -----------------------------

    public function addItem(Request $request)
    {
        $user = $request->user();
        $carrito = Carrito::firstOrCreate(['user_id' => $user->id]);

        $validated = $request->validate([
            'producto_id'    => 'required|exists:productos,id',
            'cantidad_kg'    => 'required|numeric|min:0.5',
            'precio_unitario' => 'required|numeric|min:0',
        ]);

        $item = $carrito->items()->where('producto_id', $validated['producto_id'])->first();

        if ($item) {
            $item->cantidad_kg += $validated['cantidad_kg'];
            $item->precio_unitario = $validated['precio_unitario'];
            $item->save();
        } else {
            $item = $carrito->items()->create($validated);
        }

        return response()->json($carrito->load('items.producto'));
    }

    public function updateItem(Request $request, $itemId)
    {
        $user = $request->user();
        $carrito = Carrito::firstOrCreate(['user_id' => $user->id]);

        $validated = $request->validate([
            'cantidad_kg' => 'required|numeric|min:0.5',
        ]);

        $item = $carrito->items()->findOrFail($itemId);
        $item->update($validated);

        return response()->json($carrito->load('items.producto'));
    }

    public function removeItem(Request $request, $itemId)
    {
        $user = $request->user();
        $carrito = Carrito::firstOrCreate(['user_id' => $user->id]);

        $item = $carrito->items()->findOrFail($itemId);
        $item->delete();

        return response()->json($carrito->load('items.producto'));
    }

    public function clearCarrito(Request $request)
    {
        $user = $request->user();
        $carrito = Carrito::firstOrCreate(['user_id' => $user->id]);

        $carrito->items()->delete();

        return response()->json($carrito->load('items.producto'));
    }
}
