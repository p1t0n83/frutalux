<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suscripcion;
use Illuminate\Http\Request;

class SuscripcionController extends Controller
{
    public function index()
    {
        return Suscripcion::with('usuario','entregas')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tipo_caja' => 'required|string',
            'frecuencia' => 'required|string',
            'precio' => 'required|numeric|min:0',
        ]);

        $suscripcion = Suscripcion::create($validated);
        return response()->json($suscripcion, 201);
    }

    public function show($id)
    {
        return Suscripcion::with('usuario','entregas')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $suscripcion = Suscripcion::findOrFail($id);
        $suscripcion->update($request->all());
        return response()->json($suscripcion);
    }

    public function destroy($id)
    {
        Suscripcion::destroy($id);
        return response()->json(null, 204);
    }
}
