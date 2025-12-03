<?php
// app/Http/Controllers/Api/FacturaController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class FacturaController extends Controller
{
    public function generar(Request $request)
    {
        $user = $request->user();

        // Datos de la factura
        $numero = 'FAC-' . now()->format('YmdHis');
        $fecha = now()->toDateString();
        $cliente = $user->name;
        $productos = $request->productos ?? [];
        $subtotal = $request->subtotal ?? 0;
        $gastosEnvio = $request->gastos_envio ?? 0;
        $total = $request->total ?? 0;

        // Contenido HTML simple (sin vista Blade)
        $html = "
            <h1>Factura {$numero}</h1>
            <p>Fecha: {$fecha}</p>
            <p>Cliente: {$cliente}</p>
            <h3>Productos</h3>
            <table border='1' cellpadding='5' cellspacing='0' width='100%'>
                <tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr>";

        foreach ($productos as $prod) {
            $html .= "<tr>
                        <td>{$prod['nombre']}</td>
                        <td>{$prod['cantidad']}</td>
                        <td>€{$prod['precio']}</td>
                      </tr>";
        }

        $html .= "</table>
            <p>Subtotal: €{$subtotal}</p>
            <p>Gastos envío: €{$gastosEnvio}</p>
            <p><strong>Total: €{$total}</strong></p>
        ";

        // Generar PDF directamente desde el HTML
        $pdf = Pdf::loadHTML($html);

        // Guardar en storage/app/public/facturas
        $filename = "Factura-{$numero}.pdf";
        Storage::disk('public')->put("facturas/$filename", $pdf->output());

        // Devolver URL pública (requiere php artisan storage:link)
        $url = Storage::url("facturas/$filename");

        return response($pdf->output(), 200)
         ->header('Content-Type', 'application/pdf')
         ->header('Content-Disposition', "inline; filename=Factura-{$numero}.pdf");

    }
}
