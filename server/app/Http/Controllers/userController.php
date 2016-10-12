<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests;
use App\User;
use App\role;

class userController extends Controller
{
    /*Trae todos los usuarios paginados de 10 en 10 y le cargo los roles que tiene cada usuario*/
    function AllUser (Request $request) {
        $page = $request->input('page');
        if ($page) {
          $users = User::paginate(10);
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
      return $user;
    }
}
