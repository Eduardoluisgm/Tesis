<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\fact_vent;

class fact_ventController extends Controller
{
  function AllSale (Request $request) {
    $page = $request->input('page');
    if ($page) {
      $sale = fact_vent::paginate(8);
    } else {
      $sale = fact_vent::all();
    }
    return $sale;
  }
}
