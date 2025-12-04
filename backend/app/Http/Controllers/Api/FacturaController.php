<?php
// app/Http/Controllers/Api/FacturaController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Pedido;
class FacturaController extends Controller
{
    public function generar(Request $request)
    {
        try {
            $user = $request->user();
            
            // Datos de la factura
            $numero = 'FAC-' . now()->format('YmdHis');
            $fecha = now()->format('d/m/Y');
            
            // Datos del cliente desde frontend
            $cliente = $request->cliente_nombre ?? $user->name;
            $clienteEmail = $request->cliente_email ?? $user->email ?? '';
            $clienteDireccion = $request->cliente_direccion ?? '';
            $clienteCp = $request->cliente_cp ?? '';
            $clienteLocalidad = $request->cliente_localidad ?? '';
            $clienteProvincia = $request->cliente_provincia ?? '';
            
            // Datos del vendedor (FRUTALUX)
            $vendedorNombre = 'FRUTALUX';
            $vendedorDireccion = 'Zurita';
            $vendedorCp = '39479';
            $vendedorLocalidad = 'Cantabria';
            $vendedorPais = 'España';
            $vendedorTelefono = '+34 942 000 000';
            $vendedorCif = 'B-98765432';
            
            // Tipo de pedido
            $tipoFactura = $request->tipo ?? 'pedido';
            
            // Metodo de pago
            $metodoPago = $request->metodoPago ?? 'tarjeta';
            // Obtener valores numéricos para el pedido
            $subtotalNumerico = floatval($request->subtotal ?? 0);
            $gastosEnvioNumerico = floatval($request->gastos_envio ?? 0);
            $totalNumerico = floatval($request->total ?? 0);

            // Crear pedido en la base de datos
            $numeroPedido = 'PED-' . now()->format('YmdHis');
            $direccionEnvio = $clienteDireccion . ', ' . $clienteCp . ' ' . $clienteLocalidad . ', ' . $clienteProvincia;

            $pedido = Pedido::create([
                'user_id' => $user ? $user->id : null,
                'numero_pedido' => $numeroPedido,
                'tipo_pedido' => $tipoFactura === 'suscripcion' ? 'suscripcion' : 'carrito',
                'estado' => $metodoPago === 'tarjeta' ? 'pagado' : 'pendiente',
                'subtotal' => $subtotalNumerico,
                'gastos_envio' => $gastosEnvioNumerico,
                'total' => $totalNumerico,
                'direccion_envio' => $direccionEnvio,
                'cliente_nombre' => $cliente,
                'cliente_email' => $clienteEmail,
                'metodo_pago' => $metodoPago,
                'factura_numero' => $numero, // El número de factura
                'fecha_entrega_estimada' => now()->addDays(3),
            ]);
            // Productos
            $productos = $request->productos ?? [];
            $subtotal = number_format($request->subtotal ?? 0, 2, ',', '.');
            $gastosEnvio = number_format($request->gastos_envio ?? 0, 2, ',', '.');
            $total = number_format($request->total ?? 0, 2, ',', '.');
            
            // Generar datos de pago
            $datosPago = $this->generarDatosPago($metodoPago);
            
            // Texto especial según tipo
            $textoTipo = $tipoFactura === 'suscripcion' 
                ? '<p style="background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0;"><strong>SUSCRIPCIÓN ACTIVA:</strong> Este pedido forma parte de tu suscripción recurrente.</p>'
                : '';
            
            // Generar filas de productos
            $productosHtml = '';
            foreach ($productos as $prod) {
                $nombreProd = htmlspecialchars($prod['nombre'] ?? 'Producto', ENT_QUOTES, 'UTF-8');
                $cantidad = $prod['cantidad'] ?? 1;
                $precio = number_format($prod['precio'] ?? 0, 2, ',', '.');
                $totalProd = number_format(($prod['precio'] ?? 0) * $cantidad, 2, ',', '.');
                
                $productosHtml .= "
                    <tr>
                        <td>{$nombreProd}</td>
                        <td class=\"text-center\">{$cantidad}</td>
                        <td class=\"text-right\">{$precio} EUR</td>
                        <td class=\"text-right\"><strong>{$totalProd} EUR</strong></td>
                    </tr>";
            }
            
            // HTML completo
            $html = $this->generarHtmlFactura(
                $vendedorNombre,
                $vendedorDireccion,
                $vendedorCp,
                $vendedorLocalidad,
                $vendedorPais,
                $vendedorTelefono,
                $vendedorCif,
                $numero,
                $textoTipo,
                $cliente,
                $clienteEmail,
                $clienteDireccion,
                $clienteCp,
                $clienteLocalidad,
                $clienteProvincia,
                $fecha,
                $productosHtml,
                $subtotal,
                $gastosEnvio,
                $total,
                $datosPago
            );
            
            // Crear PDF
            $pdf = Pdf::loadHTML($html)
                ->setPaper('a4', 'portrait')
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isRemoteEnabled', false);
            
            // Guardar
            $filename = "Factura-{$numero}.pdf";
            $pdfOutput = $pdf->output();
            Storage::disk('public')->put("facturas/{$filename}", $pdfOutput);

            $pedido->update([
                'factura_url' => url("storage/facturas/{$filename}")
            ]);

            return response($pdfOutput, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', "inline; filename=\"{$filename}\"")
            ->header('X-Pedido-Id', $pedido->id)
            ->header('X-Pedido-Numero', $pedido->numero_pedido);
                
        } catch (\Exception $e) {
            Log::error('Error generando factura: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Error al generar la factura',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }
    
    private function generarHtmlFactura(
        $vendedorNombre,
        $vendedorDireccion,
        $vendedorCp,
        $vendedorLocalidad,
        $vendedorPais,
        $vendedorTelefono,
        $vendedorCif,
        $numero,
        $textoTipo,
        $cliente,
        $clienteEmail,
        $clienteDireccion,
        $clienteCp,
        $clienteLocalidad,
        $clienteProvincia,
        $fecha,
        $productosHtml,
        $subtotal,
        $gastosEnvio,
        $total,
        $datosPago
    ) {
        return '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            color: #333; 
            font-size: 11px; 
            margin: 0;
            padding: 0;
        }
        .container { 
            padding: 40px; 
            max-width: 750px;
            margin: 0 auto;
        }
        .header { 
            margin-bottom: 40px; 
            border-bottom: 3px solid #2c3e50; 
            padding-bottom: 20px;
            overflow: hidden;
        }
        .header-left {
            float: left;
            width: 55%;
        }
        .header-right {
            float: right;
            width: 40%;
            text-align: right;
        }
        .company { 
            font-size: 22px; 
            font-weight: bold; 
            color: #2c3e50;
            margin-bottom: 8px; 
        }
        .company-details {
            font-size: 9px;
            color: #7f8c8d;
            line-height: 1.5;
        }
        .invoice-title { 
            font-size: 26px; 
            font-weight: bold; 
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .invoice-number { 
            color: #7f8c8d; 
            font-size: 11px;
        }
        .clear { clear: both; }
        .info-section {
            margin: 30px 0;
            overflow: hidden;
        }
        .info-box { 
            background: #f8f9fa; 
            padding: 15px; 
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
            float: left;
            width: 47%;
        }
        .info-box:last-child {
            float: right;
            border-left-color: #e74c3c;
        }
        .info-box h3 {
            font-size: 9px;
            color: #7f8c8d;
            text-transform: uppercase;
            margin: 0 0 10px 0;
            letter-spacing: 1px;
        }
        .info-box p {
            margin: 5px 0;
            font-size: 11px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 30px 0; 
        }
        thead {
            background: #2c3e50;
        }
        th { 
            background: #2c3e50; 
            color: #ffffff; 
            padding: 12px 10px; 
            text-align: left; 
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        td { 
            padding: 12px 10px; 
            border-bottom: 1px solid #ecf0f1; 
            font-size: 11px;
        }
        tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals { 
            margin-top: 30px; 
            float: right; 
            width: 280px; 
        }
        .totals table {
            margin: 0;
        }
        .totals td { 
            border: none;
            padding: 8px 15px;
        }
        .subtotal-row {
            font-size: 10px;
        }
        .total-row { 
            background: #2c3e50; 
            color: #ffffff; 
            font-weight: bold; 
            font-size: 13px;
        }
        .payment-info {
            background: #e8f5e9;
            padding: 15px;
            margin: 30px 0;
            border-left: 4px solid #4caf50;
            clear: both;
        }
        .payment-info h3 {
            font-size: 11px;
            color: #2e7d32;
            margin: 0 0 10px 0;
            text-transform: uppercase;
        }
        .payment-info p {
            margin: 5px 0;
            font-size: 10px;
        }
        .footer {
            margin-top: 80px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
            font-size: 9px;
            color: #95a5a6;
            clear: both;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <div class="company">' . $vendedorNombre . '</div>
                <div class="company-details">
                    ' . $vendedorDireccion . '<br>
                    ' . $vendedorCp . ' ' . $vendedorLocalidad . ', ' . $vendedorPais . '<br>
                    Tel: ' . $vendedorTelefono . '<br>
                    CIF: ' . $vendedorCif . '
                </div>
            </div>
            <div class="header-right">
                <div class="invoice-title">FACTURA</div>
                <div class="invoice-number">' . $numero . '</div>
            </div>
            <div class="clear"></div>
        </div>
        
        ' . $textoTipo . '
        
        <div class="info-section">
            <div class="info-box">
                <h3>Facturar a:</h3>
                <p><strong>' . $cliente . '</strong></p>
                <p>' . $clienteEmail . '</p>
                <p>' . $clienteDireccion . '</p>
                <p>' . $clienteCp . ' ' . $clienteLocalidad . '</p>
                <p>' . $clienteProvincia . '</p>
            </div>
            <div class="info-box">
                <h3>Fecha de emisión:</h3>
                <p><strong>' . $fecha . '</strong></p>
            </div>
            <div class="clear"></div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 50%">Producto</th>
                    <th class="text-center" style="width: 15%">Cantidad</th>
                    <th class="text-right" style="width: 15%">Precio Unit.</th>
                    <th class="text-right" style="width: 20%">Total</th>
                </tr>
            </thead>
            <tbody>
                ' . $productosHtml . '
            </tbody>
        </table>
        
        <div class="totals">
            <table>
                <tr class="subtotal-row">
                    <td>Subtotal:</td>
                    <td class="text-right">' . $subtotal . ' EUR</td>
                </tr>
                <tr class="subtotal-row">
                    <td>Gastos de envío:</td>
                    <td class="text-right">' . $gastosEnvio . ' EUR</td>
                </tr>
                <tr class="total-row">
                    <td>TOTAL:</td>
                    <td class="text-right">' . $total . ' EUR</td>
                </tr>
            </table>
        </div>
        
        <div class="payment-info">
            <h3>Información de Pago</h3>
            ' . $datosPago . '
        </div>
        
        <div class="footer">
            <p>Gracias por confiar en FRUTALUX</p>
            <p>Para cualquier consulta, contacte con nosotros en info@frutalux.com</p>
        </div>
    </div>
</body>
</html>';
    }
    
    private function generarDatosPago($metodoPago)
    {
        switch ($metodoPago) {
            case 'tarjeta':
                return '<p><strong>Método:</strong> Tarjeta de crédito/débito</p>
                        <p><strong>Número:</strong> **** **** **** 4532</p>
                        <p><strong>Fecha:</strong> ' . now()->format('d/m/Y H:i') . '</p>
                        <p><strong>Estado:</strong> PAGADO</p>';
                        
            case 'transferencia':
                return '<p><strong>Método:</strong> Transferencia bancaria</p>
                        <p><strong>IBAN:</strong> ES91 2100 0418 4502 0005 1332</p>
                        <p><strong>Beneficiario:</strong> FRUTALUX SL</p>
                        <p><strong>Concepto:</strong> Pedido ' . now()->format('YmdHis') . '</p>
                        <p><strong>Estado:</strong> PENDIENTE DE RECIBIR</p>';
                        
            case 'reembolso':
                return '<p><strong>Método:</strong> Contra reembolso</p>
                        <p><strong>Importe a pagar:</strong> Al recibir el pedido</p>
                        <p><strong>Aceptamos:</strong> Efectivo y tarjeta</p>
                        <p><strong>Estado:</strong> PENDIENTE DE PAGO EN ENTREGA</p>';
                        
            default:
                return '<p><strong>Método:</strong> ' . htmlspecialchars($metodoPago, ENT_QUOTES, 'UTF-8') . '</p>';
        }
    }
}