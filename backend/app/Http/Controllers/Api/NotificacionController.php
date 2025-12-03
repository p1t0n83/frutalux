<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function index()
    {
        return Notificacion::with('usuario')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'titulo' => 'required|string|max:255',
            'mensaje' => 'required|string',
            'leida' => 'boolean',
        ]);

        $notificacion = Notificacion::create($validated);
        return response()->json($notificacion, 201);
    }

    public function show($id)
    {
        return Notificacion::with('usuario')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $notificacion = Notificacion::findOrFail($id);
        $notificacion->update($request->all());
        return response()->json($notificacion);
    }

    public function destroy($id)
    {
        Notificacion::destroy($id);
        return response()->json(null, 204);
    }
}
