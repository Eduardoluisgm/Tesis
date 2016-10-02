<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\role;

class roleController extends Controller
{
    function All () {
      $roles = role::all();
      return $roles;
    }
}
