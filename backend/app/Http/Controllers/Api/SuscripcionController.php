<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suscripcion;
use Illuminate\Http\Request;

class SuscripcionController extends Controller
{
    // Admin: todas las suscripciones
    public function index()
    {
        return Suscripcion::with('usuario', 'entregas')->latest()->get();
    }

    // Cliente: solo sus suscripciones
    public function misSuscripciones(Request $request)
    {
        $userId = $request->user()->id;

        $suscripciones = Suscripcion::with('entregas')
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json($suscripciones);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'    => 'required|exists:users,id',
            'tipo_caja'  => 'required|string',
            'frecuencia' => 'required|string',
            'precio'     => 'required|numeric|min:0',
        ]);

        $suscripcion = Suscripcion::create($validated);
        return response()->json($suscripcion, 201);
    }

    public function show($id)
    {
        return Suscripcion::with('usuario', 'entregas')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $suscripcion = Suscripcion::findOrFail($id);
        $suscripcion->update($request->all());
        return response()->json($suscripcion);
    }

    // Cliente: cancelar su propia suscripción
    public function cancelar(Request $request, $id)
    {
        $suscripcion = Suscripcion::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $suscripcion->update(['estado' => 'cancelada']);
        return response()->json($suscripcion);
    }

    public function destroy($id)
    {
        Suscripcion::destroy($id);
        return response()->json(null, 204);
    }
}