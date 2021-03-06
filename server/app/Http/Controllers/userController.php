<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests;
use App\User;
use JWTAuth;
use App\role;

class userController extends Controller
{
    /*Trae todos los usuarios paginados de 10 en 10 y le cargo los roles que tiene cada usuario*/
    function AllUser (Request $request) {
        $page = $request->input('page');
        $search = $request->input('search');
        if ($page) {
          if ($search) {
            $users = User::where('cedula', 'Like', '%' . $search . '%')
              ->orWhere('name', 'Like', '%' . $search . '%')
              ->orWhere('direccion', 'Like', '%' . $search . '%')
              ->orWhere('email', 'Like', '%' . $search . '%')
              ->paginate(8);
          } else {
            $users = User::paginate(8);
          }
        } else {
          $users = User::all();
        }
        foreach ($users as $user) {
          $user->load('role');
          $user['role_name']= $user['role']['name'];
          unset($user['role']);
        }
        return $users;
    }

    /*Busca un usuario especifico*/
    function get ($cedula) {
      $user = User::findOrFail($cedula);
      $user->load('role');
      $user['role_name']= $user['role']['name'];
      unset($user['role']);
      return $user;
    }

    /*Guardar Usuario*/
    function save (Request $request) {
      $cedula = $request->input('cedula');
      $user = User::find($cedula);
      if ($user) {
        abort(409,'Existe un Usuario con esa cedula');
      }
      $new = new User;
      $new->fill($request->all());
      $new->password= Hash::make($request->input('password'));
      $new->save();
      return $new;
    }

    function patch (Request $request, $oldcedula) {
      $auth = JWTAuth::parseToken()->authenticate();
      $user = User::find($request->input('cedula'));
      $oldUser = User::findOrFail($oldcedula);
      if ($user && $user->cedula != $oldUser->cedula) {
        abort(409,'Existe un Usuario con esa cedula');
      }
        $oldUser->fill($request->all());
        if ($request->input('password')) { /*Si cambia la contrase;a */
          $oldUser->password= Hash::make($request->input('password'));
        }
        $oldUser->save();
        return $oldUser;
    }

    function delete ($cedula) {
      $user = User::findOrFail($cedula);
      $user->delete();
      return "Eliminado";
    }
}
