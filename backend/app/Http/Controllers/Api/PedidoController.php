<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function index()
    {
        return Pedido::with('usuario','detalles','pagos')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'numero_pedido' => 'required|string|unique:pedidos,numero_pedido',
            'tipo_pedido' => 'required|in:carrito,suscripcion',
            'subtotal' => 'required|numeric|min:0',
            'gastos_envio' => 'numeric|min:0',
            'total' => 'required|numeric|min:0',
            'direccion_envio' => 'required|string',
            'notas' => 'nullable|string',
            'fecha_entrega_estimada' => 'nullable|date',
        ]);

        $pedido = Pedido::create($validated);
        return response()->json($pedido, 201);
    }

    public function show($id)
    {
        return Pedido::with('usuario','detalles','pagos')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->update($request->all());
        return response()->json($pedido);
    }

    public function destroy($id)
    {
        Pedido::destroy($id);
        return response()->json(null, 204);
    }
}
