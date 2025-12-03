<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasFactory, Notifiable,HasApiTokens;

    protected $fillable = [
        'nombre','apellidos','email','password','tipo_usuario','activo',
        'direccion','codigo_postal','localidad','provincia','telefono',
        'imagen_perfil','slug'
    ];

    protected $hidden = ['password','remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'activo' => 'boolean',
    ];

    public function carritos() { return $this->hasMany(Carrito::class); }
    public function pedidos() { return $this->hasMany(Pedido::class); }
    public function suscripciones() { return $this->hasMany(Suscripcion::class); }
    public function valoraciones() { return $this->hasMany(Valoracion::class); }
    public function notificaciones() { return $this->hasMany(Notificacion::class); }
}
