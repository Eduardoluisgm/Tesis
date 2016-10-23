<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use App\Http\Requests;

class ApiAuthController extends Controller
{

    /*Funcion de logueo*/
    public function AuthUser (Request $request) {
      $credential = $request->only('cedula','password');
      $token = null;
      try {
        if (!$token=JWTAuth::attempt($credential)) { /*attempt es la funcion con que jwt hace el logueo*/
          return response()->json(['error'=>'Credenciales Invalidas'],500);
        }
      } catch (JWTexception $ex) {
        return response()->json(['error'=>'Algo salio mal'],500);
      }

      $user = JWTAuth::toUser($token);
      if ($user->status!="1") { /*Usuario Inactivo actualmente*/
        return response()->json(['error'=>'Credenciales Invalidas'],500);
      }
      return response()->json(compact('token','user'));
    }
}
