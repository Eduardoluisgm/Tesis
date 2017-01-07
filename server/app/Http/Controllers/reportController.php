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

    /*cliente que realiza las mayores compras en monto*/
    function clientemayoresCompras () {
      $report = DB::select(DB::raw('select client.name, client.cedula,
        COUNT(client.cedula)as Cantidad,
        SUM(fact_vent.monto_total)as Monto
        FROM client, fact_vent
        WHERE client.cedula = fact_vent.client_id
        group by client.cedula, client.name
        order by Monto desc
        limit 6'));
      return $report;
    }

    /*cliente que realiza mayor cantidad de compras no importa el monto*/
    function clientevolumenCompras () {
      $report = DB::select(DB::raw('select client.name, client.cedula,
        COUNT(client.cedula)as Cantidad,
        SUM(fact_vent.monto_total)as Monto
        FROM client, fact_vent
        WHERE client.cedula = fact_vent.client_id
        group by client.cedula, client.name
        order by Cantidad desc
        limit 6'));
      return $report;
    }
}
