<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        'user_id',
        'numero_pedido',
        'tipo_pedido',
        'estado',
        'subtotal',
        'gastos_envio',
        'total',
        'direccion_envio',
        'notas',                  
        'fecha_entrega_estimada', 
        'fecha_entrega_real'       
    ];

    public function usuario() { return $this->belongsTo(User::class); }
    public function detalles() { return $this->hasMany(DetallePedido::class); }
    public function pagos() { return $this->hasMany(Pago::class); }
}

