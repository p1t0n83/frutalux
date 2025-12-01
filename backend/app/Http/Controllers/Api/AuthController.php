<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Registro de nuevo usuario
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string',
            'codigo_postal' => 'nullable|string|max:10',
            'localidad' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'nombre' => $validated['nombre'],
            'apellidos' => $validated['apellidos'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'telefono' => $validated['telefono'] ?? null,
            'direccion' => $validated['direccion'] ?? null,
            'codigo_postal' => $validated['codigo_postal'] ?? null,
            'localidad' => $validated['localidad'] ?? null,
            'provincia' => $validated['provincia'] ?? null,
            'tipo_usuario' => 'cliente', // Por defecto cliente
            'activo' => true,
            'slug' => Str::slug($validated['nombre'] . '-' . $validated['apellidos']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $user = User::with('carritos', 'pedidos', 'suscripciones', 'valoraciones', 'notificaciones')
                    ->where('email', $request->email)
                    ->firstOrFail();

        // Verificar si el usuario está activo
        if (!$user->activo) {
            throw ValidationException::withMessages([
                'email' => ['Tu cuenta ha sido desactivada. Contacta al administrador.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Logout de usuario
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    /**
     * Obtener usuario autenticado
     */
    public function me(Request $request)
    {
        $user = User::with('carritos', 'pedidos', 'suscripciones', 'valoraciones', 'notificaciones')
                    ->findOrFail($request->user()->id);

        return response()->json($user);
    }
}