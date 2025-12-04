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

    public function misPedidos(Request $request)
{
    // Obtener el usuario autenticado
    $userId = $request->user()->id;

    // Devolver solo los pedidos de ese cliente
    $pedidos = Pedido::with('detalles','pagos')
        ->where('user_id', $userId)
        ->get();

    return response()->json($pedidos);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'numero_pedido' => 'required|string|unique:pedidos,numero_pedido',
            'tipo_pedido' => 'required|in:carrito,suscripcion',
            'estado' => 'in:pendiente,pagado,enviado,entregado,cancelado',
            'subtotal' => 'required|numeric|min:0',
            'gastos_envio' => 'numeric|min:0',
            'total' => 'required|numeric|min:0',
            'direccion_envio' => 'required|string',
            'notas' => 'nullable|string',
            'fecha_entrega_estimada' => 'nullable|date',
            'fecha_entrega_real' => 'nullable|date',
            'metodo_pago' => 'nullable|string',
            'factura_numero' => 'nullable|string',
            'factura_url' => 'nullable|string',
            'cliente_email' => 'nullable|email',
            'cliente_nombre' => 'nullable|string',
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

        $validated = $request->validate([
            'estado' => 'in:pendiente,pagado,enviado,entregado,cancelado',
            'direccion_envio' => 'nullable|string',
            'notas' => 'nullable|string',
            'fecha_entrega_estimada' => 'nullable|date',
            'fecha_entrega_real' => 'nullable|date',
            'metodo_pago' => 'nullable|string',
            'factura_numero' => 'nullable|string',
            'factura_url' => 'nullable|string',
            'cliente_email' => 'nullable|email',
            'cliente_nombre' => 'nullable|string',
            'subtotal' => 'numeric|min:0',
            'gastos_envio' => 'numeric|min:0',
            'total' => 'numeric|min:0',
        ]);

        $pedido->update($validated);
        return response()->json($pedido);
    }

    public function destroy($id)
    {
        Pedido::destroy($id);
        return response()->json(null, 204);
    }
}
