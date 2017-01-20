<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class reportController extends Controller
{
    /*reporte productos mas vendidos*/
    function productomasVendido (Request $request) {
    $fecha_inicio = $request->input('fecha_inicio');
    $fecha_final = $request->input('fecha_final');
    $search = $request->input('search');

    /*los traigo todos*/
    if (!$search) {
      $report = DB::select(DB::raw('select product.nombre, product.codigo,
          SUM(fact_vent_detalles.cant) as cantidad
          FROM fact_vent_detalles, product
          where product.codigo = fact_vent_detalles.producto_id
          group by product.codigo, product.nombre
          order by Cantidad desc
          limit 10'));
        return $report;
    } else { /*filtrando por fechas*/
      $report = DB::select(DB::raw('select product.nombre, product.codigo,
          SUM(fact_vent_detalles.cant) as cantidad
          FROM fact_vent_detalles, product
          where product.codigo = fact_vent_detalles.producto_id
          and fact_vent_detalles.created_at >="'.$fecha_inicio.'"
          and fact_vent_detalles.created_at <="'.$fecha_final.'"
          group by product.codigo, product.nombre
          order by Cantidad desc
          limit 10'));
        return $report;
    }

    }

    /*reporte Producto mas comprado a los preoveedores*/
    function productomasComprado (Request $request) {
      $fecha_inicio = $request->input('fecha_inicio');
      $fecha_final = $request->input('fecha_final');
      $search = $request->input('search');
      if (!$search) { /*Busco todos*/
        $report = DB::select(DB::raw('select product.nombre, product.codigo,
            SUM(fact_comp_detalles.cant) as cantidad
            FROM fact_comp_detalles, product
            where product.codigo = fact_comp_detalles.producto_id
            group by product.codigo, product.nombre
            order by Cantidad desc
            limit 10'));
          return $report;
      } else {
        $report = DB::select(DB::raw('select product.nombre, product.codigo,
            SUM(fact_comp_detalles.cant) as cantidad
            FROM fact_comp_detalles, product
            where product.codigo = fact_comp_detalles.producto_id
            and fact_comp_detalles.created_at >="'.$fecha_inicio.'"
            and fact_comp_detalles.created_at <="'.$fecha_final.'"
            group by product.codigo, product.nombre
            order by Cantidad desc
            limit 10'));
          return $report;
      }
    }

    /*cliente que realiza las mayores compras en monto*/
    function clientemayoresCompras (Request $request) {
      $fecha_inicio = $request->input('fecha_inicio');
      $fecha_final = $request->input('fecha_final');
      $search = $request->input('search');
      if (!$search) { /*Busco todos*/
        $report = DB::select(DB::raw('select client.name, client.cedula,
          COUNT(client.cedula)as Cantidad,
          SUM(fact_vent.monto_total)as Monto
          FROM client, fact_vent
          WHERE client.cedula = fact_vent.client_id
          group by client.cedula, client.name
          order by Monto desc
          limit 6'));
        return $report;
      } else {
        $report = DB::select(DB::raw('select client.name, client.cedula,
          COUNT(client.cedula)as Cantidad,
          SUM(fact_vent.monto_total)as Monto
          FROM client, fact_vent
          WHERE client.cedula = fact_vent.client_id
          and fact_vent.created_at >="'.$fecha_inicio.'"
          and fact_vent.created_at <="'.$fecha_final.'"
          group by client.cedula, client.name
          order by Monto desc
          limit 6'));
        return $report;
      }
    }

    /*cliente que realiza mayor cantidad de compras no importa el monto*/
    function clientevolumenCompras (Request $request) {
      $fecha_inicio = $request->input('fecha_inicio');
      $fecha_final = $request->input('fecha_final');
      $search = $request->input('search');
      if (!$search) { /*Busco todos*/
        $report = DB::select(DB::raw('select client.name, client.cedula,
          COUNT(client.cedula)as Cantidad,
          SUM(fact_vent.monto_total)as Monto
          FROM client, fact_vent
          WHERE client.cedula = fact_vent.client_id
          group by client.cedula, client.name
          order by Cantidad desc
          limit 6'));
        return $report;
      } else {
        $report = DB::select(DB::raw('select client.name, client.cedula,
          COUNT(client.cedula)as Cantidad,
          SUM(fact_vent.monto_total)as Monto
          FROM client, fact_vent
          WHERE client.cedula = fact_vent.client_id
          and fact_vent.created_at >="'.$fecha_inicio.'"
          and fact_vent.created_at <="'.$fecha_final.'"
          group by client.cedula, client.name
          order by Cantidad desc
          limit 6'));
        return $report;
      }
    }

    /*proveedor que realiza mayor cantidad de compras no importa el monto*/
    function proveedorvolumenCompras(Request $request) {
      $fecha_inicio = $request->input('fecha_inicio');
      $fecha_final = $request->input('fecha_final');
      $search = $request->input('search');
      if (!$search) { /*Busco todos*/
        $report = DB::select(DB::raw('select provider.nombre, provider.rif,
          COUNT(provider.rif)as Cantidad,
          SUM(fact_comp.monto_total)as Monto
          FROM provider, fact_comp
          WHERE provider.rif = fact_comp.provider_id
          group by provider.rif, provider.nombre
          order by Cantidad desc
          limit 6'));
        return $report;
      } else {
        $report = DB::select(DB::raw('select provider.nombre, provider.rif,
          COUNT(provider.rif)as Cantidad,
          SUM(fact_comp.monto_total)as Monto
          FROM provider, fact_comp
          WHERE provider.rif = fact_comp.provider_id
          and fact_comp.created_at >="'.$fecha_inicio.'"
          and fact_comp.created_at <="'.$fecha_final.'"
          group by provider.rif, provider.nombre
          order by Cantidad desc
          limit 6'));
        return $report;
      }
    }

    /*proveedor que realiza mayor cantidad de compras no importa el monto*/
    function proveedormayoresCompras(Request $request) {
      $fecha_inicio = $request->input('fecha_inicio');
      $fecha_final = $request->input('fecha_final');
      $search = $request->input('search');
      if (!$search) { /*Busco todos*/
        $report = DB::select(DB::raw('select provider.nombre, provider.rif,
          COUNT(provider.rif)as Cantidad,
          SUM(fact_comp.monto_total)as Monto
          FROM provider, fact_comp
          WHERE provider.rif = fact_comp.provider_id
          group by provider.rif, provider.nombre
          order by Monto desc
          limit 6'));
        return $report;
      } else {
        $report = DB::select(DB::raw('select provider.nombre, provider.rif,
          COUNT(provider.rif)as Cantidad,
          SUM(fact_comp.monto_total)as Monto
          FROM provider, fact_comp
          WHERE provider.rif = fact_comp.provider_id
          and fact_comp.created_at >="'.$fecha_inicio.'"
          and fact_comp.created_at <="'.$fecha_final.'"
          group by provider.rif, provider.nombre
          order by Monto desc
          limit 6'));
        return $report;
      }
    }
}
