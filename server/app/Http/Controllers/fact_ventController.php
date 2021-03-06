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
    $search = $request->input('search');
    $fecha_inicio = $request->input('fecha_inicio');
    $fecha_final = $request->input('fecha_final');
    if ($page) {
      if ($search) {
        $sale = fact_vent::where('id', 'Like', '%' . $search . '%')
            ->whereBetween('created_at', array($fecha_inicio, $fecha_final))
            ->orWhere('client_id', 'Like', '%' . $search . '%')
            ->whereBetween('created_at', array($fecha_inicio, $fecha_final))
            ->orderBy('created_at','desc')
            ->paginate(8);
      } else {
        $sale = fact_vent::whereBetween('created_at', array($fecha_inicio, $fecha_final))
          ->orderBy('created_at','desc')->paginate(8);
      }
    } else {
      $sale = fact_vent::whereBetween('created_at', array($fecha_inicio, $fecha_final))->get();
    }
    $sale->load('cliente');
    return $sale;
  }

  /*funcion que devuelve la diferencia a pagar*/
  function diferencia () {
    $facturas = fact_vent::where('status','=',2)->get();
    $suma = 0;
    foreach ($facturas as $factura) {
      $suma = $suma + ($factura->monto_total-$factura->monto_cancelado);
    }
    $montos['total']= $suma;
    return $montos;
  }


  /*pdf de la factura de venta*/
  function FacturaPdf($id) {
    $factura = fact_vent::findOrFail($id);
    $factura->load('detalles');
    $factura->load('pagos');
    $factura->load('cliente');
    foreach ($factura->detalles as $detalle) {
      $detalle->load('producto');
    }
   // return $factura;
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
          if (isset($pago->banco_id)) {
            $factura_pago->bank_id = $pago->banco_id;
          }
          $factura_pago->save();
        }
      }
    }
    return $factura_venta;
  }

  /*Agregar pagos a una factura de venta que tenia cuenta pendiente*/
  function AddPagos ($id, Request $request) {
    $pagos = json_decode($request->input('pagos'));
    /*recorro los pagos y voy guardando*/
    foreach ($pagos as $pago) {
      $factura_pago = new fact_vent_pagos;
      $factura_pago->factura_id = $id;
      $factura_pago->tipo = $pago->tipo;
      $factura_pago->monto = $pago->monto;
      if (isset($pago->banco_id)) {
        $factura_pago->bank_id = $pago->banco_id;
      }
      $factura_pago->save();
    }

    $SumaPago = fact_vent_pagos::where('factura_id','=',$id)->sum("monto"); /*Sumo la cantidad de pagos*/
    $factura = fact_vent::find($id); /*pido la factura*/
    $factura->monto_cancelado = $SumaPago;
    if ($factura->monto_total<=$factura->monto_cancelado) { /*Si ya pague la factura*/
      $factura->status = 1;
    }
    $factura->save();
    return "Guardado";
  }

  /*Cuentas por cobrar*/
  function Cuenta_cobrar (Request $request) {
    $page = $request->input('page');
    $search = $request->input('search');
    if ($page) {
      if ($search) {
        $factura = fact_vent::where('status','=',"2")
            ->where('id', 'Like', '%' . $search . '%')
            ->orWhere('client_id', 'Like', '%' . $search . '%')
            ->where('status','=',"2")
            ->orderBy('created_at','desc')
            ->paginate(8);
      } else {
        $factura = fact_vent::where('status','=',"2")->orderBy('created_at','desc')->paginate(8);
      }
    } else {
      $factura = fact_vent::where('status','=',"2")->get();
    }
    $factura->load('cliente');
    return $factura;
  }

  /*Obtiene los pagos realizados a una factura*/
  function Factura_Pagos ($id) {
    $pagos = fact_vent_pagos::where('factura_id','=',$id)->get();
    return $pagos;
  }

  /*eliminar factura de venta*/
  function delete ($id) {
    $factura = fact_vent::findOrFail($id);
    $factura->delete();
    return "Eliminado";
  }
}
