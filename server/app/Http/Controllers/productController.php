<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Product;
class productController extends Controller
{
    function AllProducts (Request $request) {
      $page = $request->input('page');
      $search = $request->input('search');
      if ($page) {
        if ($search) {
          $Products = Product::where('codigo', 'Like', '%' . $search . '%')
              ->orWhere('nombre', 'Like', '%' . $search . '%')
              ->paginate(8);
        } else {
          $Products = Product::paginate(8);
        }
      } else {
        $Products = Product::all();
      }
      return $Products;
    }

    /*Proveedores que expenden un producto*/
    function Product_providers ($codigo) {
      $product = Product::findOrFail($codigo);
      $product->load('providers');
      return $product;
    }

    /*Productos qu estan activos*/
    function ProductActive() {
      $product = Product::where('status', '=', '1')
        ->orderBy('nombre')
        ->get();
      return $product;
    }

    function get ($codigo) {
      $product = Product::findOrFail($codigo);
      $product->load('category');
      return $product;
    }

    function save (Request $request) {
      $codigo = $request->input('codigo');
      $product = Product::find($codigo);
      if ($product) {
        abort(409,'Existe un Producto con ese codigo');
      }
      $new = new Product;
      $new->fill($request->all());
      $new->save();
      return $new;
    }

    /*Buscar un producto especifico*/
    function SearchProduct(Request $request){
      $name = $request->input('name');
      $products = Product::where('nombre', 'Like', '%' . $name . '%')
          ->orWhere('codigo', 'Like', '%' . $name . '%')
          ->take(10)->get();
      return $products;
    }

    function patch (Request $request, $oldcodigo) {
      $product = Product::find($request->input('codigo'));
      $oldProduct = Product::findOrFail($oldcodigo);
      if ($product && $product->codigo != $oldProduct->codigo) {
        abort(409,'Existe un Producto con ese codigo');
      }
      $oldProduct->fill($request->all());
      $oldProduct->save();
      return $oldProduct;
    }
}
