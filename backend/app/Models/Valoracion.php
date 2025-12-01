<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Valoracion extends Model
{

    protected $table = 'valoraciones';
    protected $fillable = ['user_id','producto_id','puntuacion','comentario'];

    public function usuario() { return $this->belongsTo(User::class); }
    public function producto() { return $this->belongsTo(Producto::class); }
}
