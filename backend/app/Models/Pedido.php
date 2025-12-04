<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';

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
        'fecha_entrega_real',
        'metodo_pago',
        'factura_numero',
        'factura_url',
        'cliente_email',
        'cliente_nombre',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }
}
