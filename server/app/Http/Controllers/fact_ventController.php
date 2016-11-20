<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\fact_vent;

class fact_ventController extends Controller
{
  /*Todas las facturas de venta*/
  function AllSale (Request $request) {
    $page = $request->input('page');
    if ($page) {
      $sale = fact_vent::paginate(8);
    } else {
      $sale = fact_vent::all();
    }
    return $sale;
  }

  /*guarda la factura de venta*/
  function GuardarFactura (Request $request) {
    $factura_venta = new fact_vent;
    $factura_venta->fill($request->all());
    $factura_venta->save();
    return $factura_venta;
  }
}
