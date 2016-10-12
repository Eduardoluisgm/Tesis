<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
/*Todas las rutas que seran accedidas por app externas colocando el cors ya tienen permiso*/
Route::group(['middleware' => 'cors'], function (){
    /*Login*/
    Route::post('login','ApiAuthController@AuthUser');

    /*User*/
    Route::get('user', 'userController@AllUser');
    Route::get('user/{cedula}', 'userController@get');
    Route::post('user', 'userController@save');

    /*Roles*/
    Route::get('role','roleController@All');
    
    /*Profile*/
    Route::get('profile', 'profileController@get');

});
