<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\fact_vent;
use App\fact_vent_detalles;
use App\fact_vent_pagos;
use App\Product;
use PDF;

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


  function FacturaPdf($id) {
    $factura = fact_vent::findOrFail($id);
    $factura->load('detalles');
    $factura->load('pagos');
    $pdf = PDF::loadView('invoice', compact('factura'));
    return $pdf->download('welcome.pdf');
  }

  /*guarda la factura de venta*/
  function GuardarFactura (Request $request) {
    $detalles = json_decode($request->input('detalles'));
    $pagos = json_decode($request->input('pagos'));

    $factura_venta = new fact_vent;
    $factura_venta->fill($request->all());
    if ($factura_venta->save()) {
      if ($detalles) { /*Detalles de la factura*/
        foreach ($detalles as $detalle) {
          $factura_detalle = new fact_vent_detalles;
          $factura_detalle->factura_id = $factura_venta->id;
          $factura_detalle->producto_id = $detalle->codigo;
          $factura_detalle->precio_compra = $detalle->precio_costo;
          $factura_detalle->precio_venta = $detalle->precio_venta;
          $factura_detalle->cant = $detalle->cantidad;
          $factura_detalle->monto_total = $detalle->cantidad*$detalle->precio_venta;
          $factura_detalle->save();
            /*Descontando del stock*/
          $producto = Product::find($detalle->codigo);
          $producto->stock = ($producto->stock - $detalle->cantidad);
          $producto->save();
        }
      }
      if ($pagos) { /*Pagos de la factura*/
        foreach ($pagos as $pago) {
          $factura_pago = new fact_vent_pagos;
          $factura_pago->factura_id = $factura_venta->id;
          $factura_pago->tipo = $pago->tipo;
          $factura_pago->monto = $pago->monto;
          $factura_pago->save();
        }
      }
    }
    return $factura_venta;
  }
}
