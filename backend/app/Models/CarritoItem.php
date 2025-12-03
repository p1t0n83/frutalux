<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarritoItem extends Model
{
    // Nombre de la tabla (si no sigue la convención pluralizada)
    protected $table = 'carrito_items';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'carrito_id',
        'producto_id',
        'cantidad_kg',
        'precio_unitario',
    ];

    // Relaciones
    public function carrito()
    {
        return $this->belongsTo(Carrito::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
