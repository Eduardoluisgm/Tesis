<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\fact_comp;
use App\fact_comp_detalles;
use App\fact_comp_pagos;
use App\Product;
use App\provider_product;
use App\cuenta_pagos;
use App\cuentas;
use PDF;

class fact_compController extends Controller
{

    /*todas las facturas de compra*/
    function all(Request $request) {
      $page = $request->input('page');
      $search = $request->input('search');
      if ($page) {
        if ($search) { ///cuando se esta filtrando
          $factura = fact_comp::where('id', 'Like', '%' . $search . '%')
              ->orWhere('provider_id', 'Like', '%' . $search . '%')
              ->orderBy('created_at','desc')
              ->paginate(8);
        } else {
          $factura = fact_comp::orderBy('created_at','desc')->paginate(8);
        }
      } else {
        $factura = fact_comp::all();
      }
      $factura->load('proveedor');
      return $factura;
    }

    /*Guarda las facturas de compra*/
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
            $factura_detalle->monto_total = $detalle->cantidad*$detalle->precio_costo;
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
            }
          }
        }
        if ($pagos) { /*Pagos de la factura*/
          foreach ($pagos as $pago) {
            $factura_pago = new fact_comp_pagos;
            $factura_pago->factura_id = $factura_compra->id;
            $factura_pago->tipo = $pago->tipo;
            $factura_pago->monto = $pago->monto;
            if (isset($pago->cuenta_id)) {
              $factura_pago->cuenta_id = $pago->cuenta_id;
              $this->GuardarEgreso($factura_compra->id, $pago->cuenta_id, $pago->monto, $pago->tipo, $factura_compra->created_at);
            }
            $factura_pago->save();
          }
        }
      }
      return $factura_compra;
    }

    function GuardarEgreso ($factura_id, $cuenta_id, $monto, $tipo, $fecha) {
      $new = new cuenta_pagos;
      $new->tipo ="Egreso";
      $new->cuenta_id = $cuenta_id;
      $new->factura_id = $factura_id;
      $new->monto = $monto;
      $new->fecha_pago = $fecha;
      if ($tipo=="Cheque") {
        $new->referencia = "Cheque";
      } else if ($tipo=="Debito") {
        $new->referencia = "Nota debito";
      } else if ($tipo=="Credito") {
        $new->referencia = "Nota credito";
      }
      $new->save();
      $this->actualizar_saldo($cuenta_id);
      return $new;
    }

    function actualizar_saldo ($id) {
     $cuenta = cuentas::find($id);
     $cuenta->load('movimientos');
     $saldo = 0;

     foreach ($cuenta->movimientos as $movimiento) {
       if ($movimiento->tipo=="Ingreso") {
         $saldo = $saldo+$movimiento->monto;
       } else {
         $saldo = $saldo-$movimiento->monto;
       }
     }

     $cuenta->saldo = $saldo;
     $cuenta->save();
     return $saldo;
   }

    /*Trae todas las cuentas por pagar status = 2*/
    function Cuenta_pagar(Request $request) {
      $page = $request->input('page');
      $search = $request->input('search');
      if ($page) {
        if ($search) {
          $factura = fact_comp:: where('status','=',"2")
              ->where('id', 'Like', '%' . $search . '%')
              ->orWhere('provider_id', 'Like', '%' . $search . '%')
              ->where('status','=',"2")
              ->orderBy('created_at','desc')
              ->paginate(8);
        } else {
          $factura = fact_comp::where('status','=',"2")->orderBy('created_at','desc')->paginate(8);
        }
      } else {
        $factura = fact_comp::where('status','=',"2")->get();
      }
      $factura->load('proveedor');
      return $factura;
    }

    /*pdf de la factura de compra*/
    function FacturaPdf($id) {
      $factura = fact_comp::findOrFail($id);
      $factura->load('proveedor');
      $factura->load('detalles');
      $factura->load('pagos');
      foreach ($factura->detalles as $detalle) {
        $detalle->load('producto');

      }
      //return $factura;
      $pdf = PDF::loadView('pdfCompra', compact('factura'));
      return $pdf->download('welcome.pdf');
    }


    /*Agregar pagos a una factura de compra que tenia cuenta pendiente*/
    function AddPagos ($id, Request $request) {
      $pagos = json_decode($request->input('pagos'));
      /*recorro los pagos y voy guardando*/
      foreach ($pagos as $pago) {
        $factura_pago = new fact_comp_pagos;
        $factura_pago->factura_id = $id;
        $factura_pago->tipo = $pago->tipo;
        $factura_pago->monto = $pago->monto;
        if (isset($pago->cuenta_id)) {
          $factura_pago->cuenta_id = $pago->cuenta_id;
        }
        $factura_pago->save();
        if (isset($pago->cuenta_id)) {
          $this->GuardarEgreso($id, $pago->cuenta_id, $pago->monto, $pago->tipo, $factura_pago->created_at);
        }
      }

      $SumaPago = fact_comp_pagos::where('factura_id','=',$id)->sum("monto"); /*Sumo la cantidad de pagos*/
      $factura = fact_comp::find($id); /*pido la factura*/
      $factura->monto_cancelado = $SumaPago;
      if ($factura->monto_total<=$factura->monto_cancelado) { /*Si ya pague la factura*/
        $factura->status = 1;
      }
      $factura->save();
      return "Guardado";
    }


    /*eliminar factura de compra*/
    function delete ($id) {
      $factura = fact_comp::findOrFail($id);
      $cuenta_pagos = cuenta_pagos::where('factura_id', '=', $id)->get();
      $factura->delete();
      foreach ($cuenta_pagos as $pago) {
        $this->actualizar_saldo($pago->cuenta_id);
      }
      return "Eliminado";
    }

}
