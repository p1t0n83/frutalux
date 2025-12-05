<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suscripcion extends Model
{

    protected $table = 'suscripciones';
    protected $fillable = [
        'user_id',
        'tipo_caja',
        'frecuencia',
        'precio',
        'estado',
        'fecha_inicio',
        'fecha_fin'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
    public function entregas()
    {
        return $this->hasMany(EntregaSuscripcion::class);
    }
}
