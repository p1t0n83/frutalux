<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ImagenProducto;
use App\Models\Producto;

class ImagenesProductoSeeder extends Seeder
{
    public function run(): void
    {
        // Recorremos todos los productos existentes
        $productos = Producto::all();

        foreach ($productos as $producto) {
            // Imagen principal
            ImagenProducto::create([
                'producto_id'   => $producto->id,
                'nombre_imagen' => $producto->slug . '-1.jpg',
                'url_imagen'    => '/img/productos/' . $producto->slug . '-1.jpg',
                'es_principal'  => true,
                'orden'         => 1,
            ]);

            // Imagen secundaria
            ImagenProducto::create([
                'producto_id'   => $producto->id,
                'nombre_imagen' => $producto->slug . '-2.jpg',
                'url_imagen'    => '/img/productos/' . $producto->slug . '-2.jpg',
                'es_principal'  => false,
                'orden'         => 2,
            ]);
        }
    }
}
