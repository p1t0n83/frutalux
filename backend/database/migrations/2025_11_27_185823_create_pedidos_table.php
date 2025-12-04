<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('numero_pedido', 50)->unique();
            $table->enum('tipo_pedido', ['carrito','suscripcion']);
            $table->enum('estado', ['pendiente','pagado','enviado','entregado','cancelado'])->default('pendiente');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('gastos_envio', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->text('direccion_envio');
            $table->text('notas')->nullable(); // 👈 nuevo campo
            $table->date('fecha_entrega_estimada')->nullable(); // 👈 nuevo campo
            $table->date('fecha_entrega_real')->nullable(); // opcional, útil para trazabilidad
            $table->string('metodo_pago')->nullable(); // 'tarjeta', 'transferencia', 'reembolso'
            $table->string('factura_numero')->nullable(); // Número de factura
            $table->string('factura_url')->nullable(); // URL de la factura PDF
            $table->string('cliente_email')->nullable(); // Email del cliente
            $table->string('cliente_nombre')->nullable(); // Nombre del cliente
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};

