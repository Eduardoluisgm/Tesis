<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class reportController extends Controller
{
    /*reporte productos mas vendidos*/
    function productomasVendido () {
    $report = DB::select(DB::raw('select product.nombre, product.codigo,
        SUM(fact_vent_detalles.cant) as cantidad
        FROM fact_vent_detalles, product
        where product.codigo = fact_vent_detalles.producto_id
        group by product.codigo, product.nombre
        order by Cantidad desc
        limit 10'));
      return $report;
    }
}
