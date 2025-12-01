<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            $table->string('nombre');
            $table->string('slug', 255)->unique();
            $table->string('nombre_productor', 255)->nullable(); // 👈 nuevo campo
            $table->text('descripcion')->nullable();
            $table->decimal('precio_kg', 10, 2);
            $table->integer('stock_kg');
            $table->string('origen')->nullable();
            $table->string('temporada', 100)->nullable();
            $table->text('certificaciones')->nullable();
            $table->string('imagen', 255)->nullable();
            $table->boolean('activo')->default(true);
            $table->boolean('destacado')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
