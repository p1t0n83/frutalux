<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('apellidos')->nullable();
        $table->string('email')->unique();
        $table->string('password');

        // tipo de usuario: cliente o administrador
        $table->enum('tipo_usuario', ['cliente', 'administrador'])->default('cliente');

        // estado de cuenta
        $table->boolean('activo')->default(true);

        // datos opcionales de perfil
        $table->string('direccion')->nullable();
        $table->string('codigo_postal', 10)->nullable();
        $table->string('localidad', 100)->nullable();
        $table->string('provincia', 100)->nullable();
        $table->string('telefono', 20)->nullable();
        $table->string('imagen_perfil', 255)->nullable();
        $table->string('slug', 255)->nullable();

        $table->rememberToken();
        $table->timestamps();

        // índices útiles
        $table->index('email');
        $table->index('slug');
        $table->index(['tipo_usuario', 'activo']);
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
