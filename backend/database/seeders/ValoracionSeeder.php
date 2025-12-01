<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Valoracion;
use App\Models\User;

class ValoracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        

        // Valoraciones para producto 1
        Valoracion::create([
            'user_id' => 2,
            'producto_id' => 1,
            'puntuacion' => 5,
            'comentario' => 'Producto excelente, muy fresco y de gran calidad. Volveré a comprarlo sin duda.'
        ]);

        Valoracion::create([
            'user_id' => 2,
            'producto_id' => 1,
            'puntuacion' => 4,
            'comentario' => 'Muy buena calidad, aunque el precio es un poco elevado. Recomendable.'
        ]);

        Valoracion::create([
            'user_id' => 2,
            'producto_id' => 1,
            'puntuacion' => 5,
            'comentario' => 'Llegó en perfectas condiciones. La frescura es increíble.'
        ]);

        // Valoraciones para producto 2
        Valoracion::create([
            'user_id' => 2,
            'producto_id' => 2,
            'puntuacion' => 4,
            'comentario' => 'Buen producto, cumple con las expectativas. Envío rápido.'
        ]);

        Valoracion::create([
            'user_id' => 2,
            'producto_id' => 2,
            'puntuacion' => 3,
            'comentario' => 'Está bien, pero esperaba un poco más por el precio que tiene.'
        ]);

        Valoracion::create([
            'user_id' => 2,
            'producto_id' => 2,
            'puntuacion' => 5,
            'comentario' => 'Perfecto. Justo lo que necesitaba. Muy satisfecho con la compra.'
        ]);

        Valoracion::create([
            'user_id' => 2,
            'producto_id' => 2,
            'puntuacion' => 4,
            'comentario' => 'Buena relación calidad-precio. Lo recomiendo.'
        ]);
    }
}