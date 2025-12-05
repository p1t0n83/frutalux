<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        Producto::create([
            'categoria_id' => 1,
            'nombre' => 'Naranja Valencia',
            'slug' => 'naranja-valencia',
            'nombre_productor' => 'Cooperativa La Huerta',
            'descripcion' => 'Naranjas dulces y jugosas de Valencia',
            'precio_kg' => 2.50,
            'stock_kg' => 100,
            'origen' => 'Valencia',
            'temporada' => 'Invierno',
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => 2,
            'nombre' => 'Melocotón de Calanda',
            'slug' => 'melocoton-calanda',
            'nombre_productor' => 'Agricultores de Aragón',
            'descripcion' => 'Melocotones con denominación de origen Calanda',
            'precio_kg' => 3.20,
            'stock_kg' => 50,
            'origen' => 'Aragón',
            'temporada' => 'Verano',
            'activo' => true,
            'destacado' => false,
        ]);
    }
}
