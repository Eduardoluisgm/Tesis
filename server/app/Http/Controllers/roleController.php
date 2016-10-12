<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\role;

class roleController extends Controller
{
    function All () {
      $roles = role::where('id','>',1)->get();
      return $roles;
    }
}
