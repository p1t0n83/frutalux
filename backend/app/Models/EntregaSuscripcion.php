<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntregaSuscripcion extends Model
{
    protected $table = 'entregas_suscripcion';
    protected $fillable = ['suscripcion_id','fecha_programada','fecha_entregada','estado'];

    public function suscripcion() { return $this->belongsTo(Suscripcion::class); }
}

