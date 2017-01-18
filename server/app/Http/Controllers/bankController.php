<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\bank;

class bankController extends Controller
{
  function AllBank (Request $request) {
      $page = $request->input('page');
      $search = $request->input('search');
      if ($page) {
        if ($search) {
          $banks = bank::where('id', 'Like', '%' . $search . '%')
              ->orWhere('nombre', 'Like', '%' . $search . '%')
              ->orWhere('telefono', 'Like', '%' . $search . '%')
              ->orWhere('descripcion', 'Like', '%' . $search . '%')
              ->paginate(8);
        } else {
          $banks = bank::paginate(8);
        }
      } else {
        $banks = bank::all();
      }
      return $banks;
  }

  function get ($id) {
    $banco = bank::findOrFail($id);
    return $banco;
  }

  function patch (Request $request, $id) {
    $banco = bank::findOrFail($id);
    $otherBank = bank::where('nombre','=',$request->input('nombre'))->first();
    if ($otherBank && $otherBank->id!=$banco->id) {
      abort(409,'Existe un Banco con ese nombre');
    }
    $banco->fill($request->all());
    $banco->save();
    return $banco;
  }

  /*Guardar Banco*/
  function save (Request $request) {
    $new = new bank;
    $this->validate($request, $new::$rules);
    $new->fill($request->all());
    $new->save();
    return $new;
  }
}
