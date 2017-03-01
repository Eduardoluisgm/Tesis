<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;
use App\inventario;

class inventarioController extends Controller
{
    function saveInventario (Request $request) {
      $year = $request->input('year');
      $inventario = inventario::where('year', '=',$year)->first();
      if ($inventario) {
        return "ya tengo uno";
      } else {
        $products = Product::where('stock','>',0)->get();
        $cantidad = 0;
        $monto = 0;
        foreach ($products as $product) {
          $monto = $monto + ($product->precio_costo*$product->stock);
          $cantidad = $cantidad + $product->stock;
        }
        $invent = new inventario;
        $invent->monto=$monto;
        $invent->cantidad = $cantidad;
        $invent->year = $year;
        $invent->save();
        return "Guarde";
      }
    }

    function getbyYear (Request $request) {
      $year = $request->input('year');
      $inventario = inventario::where('year', '=',$year)->first();
      return $inventario;
    }
}
