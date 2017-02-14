<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Product;
use App\fact_vent;
use App\fact_comp;

class notificationController extends Controller
{
    /*Productos que estan por debajo del stock minimo*/
    function stockMinimo () {
      $product = DB::select(DB::raw('select * from product where product.stock<product.min_stock'));
      return $product;
    }

    /*Productos que estan por encima del stock Maximo*/
    function stockMaximo () {
      $product = DB::select(DB::raw('select * from product where product.stock>product.max_stock'));
      return $product;
    }

    /*Facturas que tienen mas de 7 dias sin ser canceladas*/
    function FacturaVentaPorCobrar(Request $request) {
      $fecha = $request->input('fecha');
      $factura = fact_vent::where('status','=','2')
        ->where('created_at','<', $fecha)
        ->get();
      $factura->load('cliente');
      return $factura;
    }

    /*Facturas que tienen mas de 7 dias sin ser canceladas*/
    function FacturaCompraPorPagar(Request $request) {
      $fecha = $request->input('fecha');
      $factura = fact_comp::where('status','=','2')
        ->where('created_at','<', $fecha)
        ->get();
      $factura->load('proveedor');
      return $factura;
    }
}
