<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        // ============================
        // CÍTRICOS
        // ============================
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
            'categoria_id' => 1,
            'nombre' => 'Limón Fino',
            'slug' => 'limon-fino',
            'nombre_productor' => 'Agricultores de Murcia',
            'descripcion' => 'Limones frescos y aromáticos',
            'precio_kg' => 1.80,
            'stock_kg' => 120,
            'origen' => 'Murcia',
            'temporada' => 'Todo el año',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 1,
            'nombre' => 'Mandarina Clementina',
            'slug' => 'mandarina-clementina',
            'nombre_productor' => 'Huerta Mediterránea',
            'descripcion' => 'Mandarinas fáciles de pelar y dulces',
            'precio_kg' => 2.20,
            'stock_kg' => 80,
            'origen' => 'Castellón',
            'temporada' => 'Invierno',
            'activo' => true,
            'destacado' => false,
        ]);

        // ============================
        // FRUTAS CON HUESO
        // ============================
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

        Producto::create([
            'categoria_id' => 2,
            'nombre' => 'Ciruela Roja',
            'slug' => 'ciruela-roja',
            'nombre_productor' => 'Frutas del Valle',
            'descripcion' => 'Ciruelas jugosas y dulces',
            'precio_kg' => 2.90,
            'stock_kg' => 60,
            'origen' => 'Extremadura',
            'temporada' => 'Verano',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 2,
            'nombre' => 'Albaricoque Murciano',
            'slug' => 'albaricoque-murciano',
            'nombre_productor' => 'Huerta del Segura',
            'descripcion' => 'Albaricoques dulces y aromáticos',
            'precio_kg' => 3.00,
            'stock_kg' => 40,
            'origen' => 'Murcia',
            'temporada' => 'Primavera',
            'activo' => true,
            'destacado' => false,
        ]);

        // ============================
        // FRUTOS ROJOS
        // ============================
        Producto::create([
            'categoria_id' => 3,
            'nombre' => 'Fresa de Huelva',
            'slug' => 'fresa-huelva',
            'nombre_productor' => 'Cooperativa Fresón',
            'descripcion' => 'Fresas frescas y aromáticas',
            'precio_kg' => 4.00,
            'stock_kg' => 70,
            'origen' => 'Huelva',
            'temporada' => 'Primavera',
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => 3,
            'nombre' => 'Frambuesa Asturiana',
            'slug' => 'frambuesa-asturiana',
            'nombre_productor' => 'Frutos del Norte',
            'descripcion' => 'Frambuesas frescas y ácidas',
            'precio_kg' => 5.50,
            'stock_kg' => 30,
            'origen' => 'Asturias',
            'temporada' => 'Verano',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 3,
            'nombre' => 'Arándano Gallego',
            'slug' => 'arandano-gallego',
            'nombre_productor' => 'Bosques de Galicia',
            'descripcion' => 'Arándanos frescos y antioxidantes',
            'precio_kg' => 6.00,
            'stock_kg' => 25,
            'origen' => 'Galicia',
            'temporada' => 'Verano',
            'activo' => true,
            'destacado' => false,
        ]);

        // ============================
        // FRUTOS SECOS
        // ============================
        Producto::create([
            'categoria_id' => 4,
            'nombre' => 'Cacahuetes Alejandro de Cantabria',
            'slug' => 'cacahuetes-alejandro-cantabria',
            'nombre_productor' => 'Alejandro de Cantabria',
            'descripcion' => 'Cacahuetes tostados de producción local',
            'precio_kg' => 7.50,
            'stock_kg' => 40,
            'origen' => 'Cantabria',
            'temporada' => 'Todo el año',
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => 4,
            'nombre' => 'Almendra Marcona',
            'slug' => 'almendra-marcona',
            'nombre_productor' => 'Agricultores de Alicante',
            'descripcion' => 'Almendras dulces y crujientes',
            'precio_kg' => 9.00,
            'stock_kg' => 60,
            'origen' => 'Alicante',
            'temporada' => 'Invierno',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 4,
            'nombre' => 'Nuez de Castilla',
            'slug' => 'nuez-castilla',
            'nombre_productor' => 'Campos de León',
            'descripcion' => 'Nueces frescas y nutritivas',
            'precio_kg' => 8.50,
            'stock_kg' => 50,
            'origen' => 'León',
            'temporada' => 'Otoño',
            'activo' => true,
            'destacado' => false,
        ]);

        // ============================
        // TROPICALES
        // ============================
        Producto::create([
            'categoria_id' => 5,
            'nombre' => 'Mango de Málaga',
            'slug' => 'mango-malaga',
            'nombre_productor' => 'Costa Tropical',
            'descripcion' => 'Mangos dulces y jugosos',
            'precio_kg' => 4.50,
            'stock_kg' => 70,
            'origen' => 'Málaga',
            'temporada' => 'Verano',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 5,
            'nombre' => 'Piña de Costa Rica',
            'slug' => 'pina-costa-rica',
            'nombre_productor' => 'Exportadora Tropical',
            'descripcion' => 'Piñas frescas y aromáticas',
            'precio_kg' => 3.80,
            'stock_kg' => 90,
            'origen' => 'Costa Rica',
            'temporada' => 'Todo el año',
            'activo' => true,
            'destacado' => false,
        ]);

                Producto::create([
            'categoria_id' => 5,
            'nombre' => 'Plátano de Canarias',
            'slug' => 'platano-canarias',
            'nombre_productor' => 'Plataneros de Canarias',
            'descripcion' => 'Plátanos dulces con denominación de origen',
            'precio_kg' => 2.70,
            'stock_kg' => 150,
            'origen' => 'Islas Canarias',
            'temporada' => 'Todo el año',
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => 5,
            'nombre' => 'Papaya Canaria',
            'slug' => 'papaya-canaria',
            'nombre_productor' => 'Agricultores de Tenerife',
            'descripcion' => 'Papayas frescas y tropicales',
            'precio_kg' => 4.20,
            'stock_kg' => 60,
            'origen' => 'Tenerife',
            'temporada' => 'Verano',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 5,
            'nombre' => 'Kiwi de Galicia',
            'slug' => 'kiwi-galicia',
            'nombre_productor' => 'Productores Atlánticos',
            'descripcion' => 'Kiwis verdes y jugosos',
            'precio_kg' => 3.60,
            'stock_kg' => 80,
            'origen' => 'Galicia',
            'temporada' => 'Invierno',
            'activo' => true,
            'destacado' => false,
        ]);

        // ============================
        // HORTALIZAS
        // ============================
        Producto::create([
            'categoria_id' => 6,
            'nombre' => 'Tomate Raf',
            'slug' => 'tomate-raf',
            'nombre_productor' => 'Huerta de Almería',
            'descripcion' => 'Tomates dulces y carnosos',
            'precio_kg' => 2.90,
            'stock_kg' => 100,
            'origen' => 'Almería',
            'temporada' => 'Invierno',
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => 6,
            'nombre' => 'Pimiento de Lodosa',
            'slug' => 'pimiento-lodosa',
            'nombre_productor' => 'Agricultores de Navarra',
            'descripcion' => 'Pimientos del piquillo con denominación de origen',
            'precio_kg' => 3.50,
            'stock_kg' => 70,
            'origen' => 'Navarra',
            'temporada' => 'Otoño',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 6,
            'nombre' => 'Cebolla Dulce de Fuentes',
            'slug' => 'cebolla-fuentes',
            'nombre_productor' => 'Huerta Aragonesa',
            'descripcion' => 'Cebollas dulces con denominación de origen',
            'precio_kg' => 1.50,
            'stock_kg' => 200,
            'origen' => 'Zaragoza',
            'temporada' => 'Verano',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 6,
            'nombre' => 'Patata de Álava',
            'slug' => 'patata-alava',
            'nombre_productor' => 'Cooperativa Vasca',
            'descripcion' => 'Patatas frescas y versátiles',
            'precio_kg' => 1.20,
            'stock_kg' => 300,
            'origen' => 'Álava',
            'temporada' => 'Todo el año',
            'activo' => true,
            'destacado' => false,
        ]);

        Producto::create([
            'categoria_id' => 6,
            'nombre' => 'Lechuga Romana',
            'slug' => 'lechuga-romana',
            'nombre_productor' => 'Huerta Murciana',
            'descripcion' => 'Lechugas frescas y crujientes',
            'precio_kg' => 1.00,
            'stock_kg' => 150,
            'origen' => 'Murcia',
            'temporada' => 'Primavera',
            'activo' => true,
            'destacado' => false,
        ]);
    }
}
