<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nombre' => 'Iker',
            'apellidos' => 'García Iturri',
            'email' => 'iker@frutalux.com',
            'password' => Hash::make('password'),
            'tipo_usuario' => 'administrador',
            'activo' => true,
            'slug' => 'iker-garcia-iturri',
        ]);

        User::create([
            'nombre' => 'Cliente',
            'apellidos' => 'Prueba',
            'email' => 'cliente@frutalux.com',
            'password' => Hash::make('password'),
            'tipo_usuario' => 'cliente',
            'activo' => true,
            'slug' => 'cliente-prueba',
        ]);
    }
}
