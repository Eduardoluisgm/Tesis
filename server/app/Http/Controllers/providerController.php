<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Provider;
class providerController extends Controller
{
    function AllProviders (Request $request) {
      $page = $request->input('page');
      $search = $request->input('search');
      if ($page) {
        if ($search) {
          $Providers = Provider::where('rif', 'Like', '%' . $search . '%')
              ->orWhere('nombre', 'Like', '%' . $search . '%')
              ->orWhere('nombre_vendedor', 'Like', '%' . $search . '%')
              ->orWhere('direccion', 'Like', '%' . $search . '%')
              ->orWhere('tipo', 'Like', '%' . $search . '%')
              ->paginate(8);
        } else {
          $Providers = Provider::paginate(8);
        }
      } else {
        $Providers = Provider::all();
      }
      return $Providers;
    }

    function get ($rif) {
      $provider = Provider::findOrFail($rif);
      return $provider;
    }

    function save (Request $request) {
      $rif = $request->input('rif');
      $provider = Provider::find($rif);
      if ($provider) {
        abort(409,'Existe un Proveedor con ese rif');
      }
      $new = new Provider;
      $new->fill($request->all());
      $new->save();
      return $new;
    }

    function patch (Request $request, $oldrif) {
      $provider = Provider::find($request->input('rif'));
      $oldProvider = Provider::findOrFail($oldrif);
      if ($provider && $provider->rif != $oldProvider->rif) {
        abort(409,'Existe un Proveedor con ese rif');
      }
      $oldProvider->fill($request->all());
      $oldProvider->save();
      return $oldProvider;
    }
}
