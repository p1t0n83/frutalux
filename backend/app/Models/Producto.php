<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'categoria_id',
        'nombre',
        'slug',
        'nombre_productor',   
        'descripcion',
        'precio_kg',
        'stock_kg',
        'origen',
        'temporada',
        'certificaciones',
        'imagen',
        'activo',
        'destacado'
    ];


    public function categoria() { return $this->belongsTo(Categoria::class); }
    public function imagenes() { return $this->hasMany(ImagenProducto::class); }
    public function valoraciones() { return $this->hasMany(Valoracion::class); }
    public function itemsCarrito() { return $this->hasMany(ItemCarrito::class); }
    public function detallesPedido() { return $this->hasMany(DetallePedido::class); }
}
