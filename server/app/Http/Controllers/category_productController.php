<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\category_product;

class category_productController extends Controller
{
    function all(Request $request) {
      $categorias= category_product::all();
      return $categorias;
    }
}
