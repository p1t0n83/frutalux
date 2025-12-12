<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        Categoria::create([
            'nombre' => 'Cítricos',
            'slug' => 'citricos',
            'descripcion' => 'Frutas cítricas frescas de temporada',
            'activo' => true,
        ]);

        Categoria::create([
            'nombre' => 'Frutas con hueso',
            'slug' => 'frutas-hueso',
            'descripcion' => 'Melocotones, ciruelas y similares',
            'activo' => true,
        ]);

        Categoria::create([
            'nombre' => 'Frutos rojos',
            'slug' => 'frutos-rojos',
            'descripcion' => 'Fresas, frambuesas, arándanos',
            'activo' => true,
        ]);

        Categoria::create([
            'nombre' => 'Frutos secos',
            'slug' => 'frutos-secos',
            'descripcion' => 'Almendras, nueces, cacahuetes y similares',
            'activo' => true,
        ]);

        Categoria::create([
            'nombre' => 'Tropicales',
            'slug' => 'tropicales',
            'descripcion' => 'Mangos, piñas, plátanos y más',
            'activo' => true,
        ]);

        Categoria::create([
            'nombre' => 'Hortalizas',
            'slug' => 'hortalizas',
            'descripcion' => 'Verduras frescas de temporada',
            'activo' => true,
        ]);
    }
}
