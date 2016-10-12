<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use Auth;
use App\Http\Requests;

class profileController extends Controller
{
  /*Obtiene el Usuario que esta logueado, necesita el token jwt*/
  function get () {
    $user = JWTAuth::parseToken()->authenticate();
    return $user;
  }
}
