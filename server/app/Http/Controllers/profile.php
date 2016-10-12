<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use App\Http\Requests;

class profile extends Controller
{
    function get () {
      $user = JWTAuth::user();
      return $user;
    }
}
