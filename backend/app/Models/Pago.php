<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $fillable = [
        'pedido_id',
        'metodo_pago_id',
        'importe',
        'estado',
        'referencia_externa',
        'fecha_pago'
    ];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
    public function metodoPago()
    {
        return $this->belongsTo(MetodoPago::class);
    }
}
