<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Client;

class clientController extends Controller
{
  function AllClient (Request $request) {
      $page = $request->input('page');
      if ($page) {
        $clients = Client::paginate(8);
      } else {
        $clients = Client::all();
      }
      return $clients;
  }

  /*Guardar Usuario*/
  function save (Request $request) {
    $cedula = $request->input('cedula');
    $client = Client::find($cedula);
    if ($client) {
      abort(409,'Existe un Cliente con esa cedula');
    }
    $new = new Client;
    $new->fill($request->all());
    $new->save();
    return $new;
  }

  function get ($cedula) {
    $client = Client::findOrFail($cedula);
    return $client;
  }

  function patch (Request $request, $oldcedula) {
    $client = Client::find($request->input('cedula'));
    $oldClient = Client::findOrFail($oldcedula);
    if ($client && $client->cedula != $oldClient->cedula) {
      abort(409,'Existe un Cliente con esa cedula');
    }
    $oldClient->fill($request->all());
    $oldClient->save();
    return $oldClient;
  }
}
