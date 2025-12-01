<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\CarritoController;
use App\Http\Controllers\Api\SuscripcionController;
use App\Http\Controllers\Api\ValoracionController;
use App\Http\Controllers\Api\NotificacionController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Rutas públicas (no requieren login)
|--------------------------------------------------------------------------
*/
Route::apiResource('categorias', CategoriaController::class)
    ->only(['index', 'show'])
    ->parameters(['categorias' => 'categoria']);

Route::apiResource('productos', ProductoController::class)
    ->only(['index', 'show'])
    ->parameters(['productos' => 'producto']);

Route::apiResource('valoraciones', ValoracionController::class)
    ->only(['index', 'show'])
    ->parameters(['valoraciones' => 'valoracion']);

/*
|--------------------------------------------------------------------------
| Autenticación (registro/login)
|--------------------------------------------------------------------------
*/
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren login con Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Perfil del usuario autenticado
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Recursos protegidos
    Route::apiResource('usuarios', UserController::class)
        ->parameters(['usuarios' => 'usuario']);
    
    Route::apiResource('pedidos', PedidoController::class)
        ->parameters(['pedidos' => 'pedido']);
    
    Route::apiResource('carritos', CarritoController::class)
        ->parameters(['carritos' => 'carrito']);
    
    Route::apiResource('suscripciones', SuscripcionController::class)
        ->parameters(['suscripciones' => 'suscripcion']);
    
    Route::apiResource('notificaciones', NotificacionController::class)
        ->parameters(['notificaciones' => 'notificacion']);
});