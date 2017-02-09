<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\cuenta_pagos;
use App\cuentas;


class cuenta_pagosController extends Controller
{

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

    /*Guardar un pago de una cuenta*/
    function Save (Request $request, $Cuenta_id) {
      $new = new cuenta_pagos;
      $new->fill($request->all());
      $new->save();
      $this->actualizar_saldo($Cuenta_id);
      return $new;
    }

    /*eliminar movimiento*/
    function delete ($id) {
      $cuenta_pagos = cuenta_pagos::findOrFail($id);
      $Cuenta_id = $cuenta_pagos->cuenta_id;
      $cuenta_pagos->delete();
      $this->actualizar_saldo($Cuenta_id);
      return "Eliminado";
    }

    /*Los movimientos realizados en una cuenta*/
    function getCuentaMovimiento (Request $request, $Cuenta_id) {
      $page = $request->input('page');
      if ($page) {
        $cuenta_pagos = cuenta_pagos::where('cuenta_id','=', $Cuenta_id)
          ->orderBy('fecha_pago','desc')
          ->paginate(8);
      } else {
        $cuenta_pagos = cuenta_pagos::where('cuenta_id','=', $Cuenta_id)
        ->orderBy('fecha_pago','desc')
        ->get();
      }
      return $cuenta_pagos;
    }
}
