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
use App\Http\Controllers\Api\ProductoImagenController;
use App\Http\Controllers\Api\FacturaController;

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
    
    // Perfil cliente
    Route::put('cliente/perfil', [AuthController::class, 'updatePerfil']);
    Route::put('cliente/password', [AuthController::class, 'updatePassword']);

    // Usuarios
    Route::apiResource('usuarios', UserController::class)
        ->parameters(['usuarios' => 'usuario']);

    // Pedidos
    Route::apiResource('pedidos', PedidoController::class)
        ->parameters(['pedidos' => 'pedido']);
    
    Route::get('mis-pedidos', [PedidoController::class, 'misPedidos']);

    /*
    |--------------------------------------------------------------------------
    | Carrito del usuario autenticado
    |--------------------------------------------------------------------------
    */
    Route::get('carrito', [CarritoController::class, 'show']);          // obtener carrito
    Route::post('carrito/add', [CarritoController::class, 'addItem']);  // añadir producto
    Route::put('carrito/items/{item}', [CarritoController::class, 'updateItem']); // actualizar cantidad
    Route::delete('carrito/items/{item}', [CarritoController::class, 'removeItem']); // eliminar producto
    Route::delete('carrito/clear', [CarritoController::class, 'clearCarrito']);     // vaciar carrito

    // Suscripciones
    Route::apiResource('suscripciones', SuscripcionController::class)
        ->parameters(['suscripciones' => 'suscripcion']);

    // Notificaciones
    Route::apiResource('notificaciones', NotificacionController::class)
        ->parameters(['notificaciones' => 'notificacion']);

    /*
    |--------------------------------------------------------------------------
    | Productos protegidos (crear, editar, borrar)
    |--------------------------------------------------------------------------
    */
    Route::apiResource('productos', ProductoController::class)
        ->only(['store', 'update', 'destroy'])
        ->parameters(['productos' => 'producto']);

    /*
    |--------------------------------------------------------------------------
    | Imágenes de productos (subir y borrar)
    |--------------------------------------------------------------------------
    */
    Route::post('productos/{producto}/imagenes', [ProductoImagenController::class, 'store']);
    Route::delete('productos/{producto}/imagenes/{imagen}', [ProductoImagenController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Facturas (requieren login)
    |--------------------------------------------------------------------------
    */
    Route::post('facturas/generar', [FacturaController::class, 'generar']);
});
