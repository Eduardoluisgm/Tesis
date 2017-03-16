<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\promotion;
use Carbon\Carbon;

class promotionController extends Controller
{
    function all(Request $request) {
      $page = $request->input('page');
      if ($page) {
        $promocion = promotion::paginate(3);
      } else {
        $promocion = promotion::all();
      }

      return $promocion;
    }

    function save(Request $request) {
      $new = new promotion();
      $new->titulo = $request->input('titulo');
      $new->descripcion = $request->input('descripcion');
      if($request->hasFile('file')) {
        $file = $request->file('file');
        $timestamp = str_replace([' ', ':'], '-', Carbon::now()->toDateTimeString());
        $name = $timestamp. '-' .$file->getClientOriginalName();
        $new->url = $name;
        $file->move(public_path().'/images/', $name);
      } else {
        abort(409,'No hay archivo');
      }
      $new->save();
      return $new;
    }
}
