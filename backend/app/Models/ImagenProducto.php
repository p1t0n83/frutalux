<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    protected $table = 'imagenes_producto';
    
    protected $fillable = [
        'producto_id',
        'nombre_imagen',
        'url_imagen',
        'es_principal',
        'orden',
    ];

    protected $appends = ['url_completa'];

    public function getUrlCompletaAttribute()
    {
        return url('img/productos/' . $this->nombre_imagen);
    }
    
    public function getUrlImagenAttribute($value)
    {
        return url('img/productos/' . $this->nombre_imagen);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}