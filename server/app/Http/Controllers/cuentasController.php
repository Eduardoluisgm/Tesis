<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\cuentas;

class cuentasController extends Controller
{
    function all (Request $request) {
      $page = $request->input('page');
      $search = $request->input('search');
      if ($page) {
        if ($search) {
          $cuentas = cuentas::join('bank','bank.id','=','cuentas.bank_id')
              ->where('cuentas.id', 'Like', '%' . $search . '%')
              ->orWhere('cuentas.numero', 'Like', '%' . $search . '%')
              ->orWhere('cuentas.descripcion', 'Like', '%' . $search . '%')
              ->orWhere('bank.nombre', 'Like', '%' . $search . '%')
              ->paginate(8);
        } else {
          $cuentas = cuentas::paginate(8);
        }
      } else {
        $cuentas = cuentas::all();
      }

      $cuentas->load('bank');
      return $cuentas;
    }

    /*Guardar una cuenta de banco*/
    function Save (Request $request) {
      $bank_id= $request->input('bank_id');
      $number = $request->input('numero');
      $oldCount = cuentas::where('bank_id','=',$bank_id)
      ->where('numero','=',$number)->first();
      if (!$oldCount) {
        $new = new cuentas;
        $new->fill($request->all());
        $new->save();
        return $new;
      } else {
        abort(409,'La cuenta ya esta registrada en este banco');
      }
    }


    /*actualizar una cuenta de banco*/
    function update (Request $request, $id) {
      $cuenta=cuentas::findOrFail($id);
      $bank_id= $request->input('bank_id');
      $number = $request->input('numero');
      $otherCount = cuentas::where('bank_id','=',$bank_id)
      ->where('numero','=',$number)
      ->where('id','!=',$id)
      ->first();

      if (!$otherCount) {
        $cuenta->fill($request->all());
        $cuenta->save();
        return $cuenta;
      } else {
        abort(409,'La cuenta ya esta registrada en este banco');
      }


    }

    /*Obtener una cuenta en especifico*/
    function get ($id) {
      $cuenta = cuentas::findOrFail($id);
      return $cuenta;
    }
}
