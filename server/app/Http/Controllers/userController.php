<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
}
