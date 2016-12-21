<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\fact_comp;
use App\fact_comp_detalles;
use App\fact_comp_pagos;
use App\Product;
use App\provider_product;

class fact_compController extends Controller
{

    function GuardarFactura (Request $request) {
      $detalles = json_decode($request->input('detalles'));
      $pagos = json_decode($request->input('pagos'));

      $factura_compra = new fact_comp;
      $factura_compra->fill($request->all());
      if ($factura_compra->save()) {
        if ($detalles) {
          foreach ($detalles as $detalle) {
            $factura_detalle = new fact_comp_detalles;
            $factura_detalle->factura_id = $factura_compra->id;
            $factura_detalle->producto_id = $detalle->codigo;
            $factura_detalle->precio_compra = $detalle->precio_costo;
            $factura_detalle->precio_venta = $detalle->precio_venta;
            $factura_detalle->cant = $detalle->cantidad;
            $factura_detalle->monto_total = $detalle->cantidad*$detalle->precio_venta;
            $factura_detalle->save();

            /*Sumando el stock*/
            $producto = Product::find($detalle->codigo);
            $producto->stock = ($producto->stock + $detalle->cantidad);
            $producto->save();

            /*Verificando el proveedor con el producto*/
            $provider_product = provider_product::where('provider_id','=',$factura_compra->provider_id)
            ->where('product_id','=',$detalle->codigo)->first();
            if (!$provider_product) {
              $new = new provider_product;
              $new->product_id = $detalle->codigo;
              $new->provider_id = $factura_compra->provider_id;
              $new->save();
              return "retorne aqui";
            }
          }
        }
        if ($pagos) { /*Pagos de la factura*/
          foreach ($pagos as $pago) {
            $factura_pago = new fact_comp_pagos;
            $factura_pago->factura_id = $factura_compra->id;
            $factura_pago->tipo = $pago->tipo;
            $factura_pago->monto = $pago->monto;
            $factura_pago->save();
          }
        }
      }
      return $factura_compra;
    }
}
