<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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


    // 👇 añadimos este campo siempre en la respuesta JSON
    protected $appends = ['url_completa'];

    public function getUrlCompletaAttribute()
    {
        // Devuelve la URL pública (ej. /storage/imagenes/archivo.jpg)
        return Storage::url('imagenes/' . $this->url_imagen);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
