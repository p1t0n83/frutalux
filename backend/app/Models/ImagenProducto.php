<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{

    protected $table='imagenes_producto';

    protected $fillable = ['producto_id','url_imagen','es_principal','orden'];

    public function producto() { return $this->belongsTo(Producto::class); }
}


