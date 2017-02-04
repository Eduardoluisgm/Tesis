<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\messages;

class messagesController extends Controller
{

  /*todos los mensajes*/
  function all(Request $request) {
    $page = $request->input('page');
    $search = $request->input('search');
    if ($page) {
      if ($search) {
        $message = messages::where('id', 'Like', '%' . $search . '%')
            ->orWhere('email', 'Like', '%' . $search . '%')
            ->orderBy('created_at','desc')
            ->paginate(8);
      } else {
        $message = messages::orderBy('created_at','desc')->paginate(8);
      }
    } else {
      $message = messages::all();
    }
    return $message;
  }

  function get ($id) {
    $mensaje = messages::findOrFail($id);
    return $mensaje;
  }

  /*Actualizar el status del message*/
  function update (Request $request, $id) {
    $message = messages::findOrFail($id);
    $message->fill($request->all());
    $message->save();
    return $message;
  }

  function delete($id) {
    $message = messages::findOrFail($id);
    $message->delete();
    return "Eliminado";
  }


  /*Guardar Mensaje*/
  function save (Request $request) {
    $new = new messages;
    $new->fill($request->all());
    $new->save();
    return $new;
  }
}
