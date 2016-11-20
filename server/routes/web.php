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

    /*client*/
    Route::get('client', 'clientController@AllClient');
    Route::get('client/{cedula}', 'clientController@get');
    Route::patch('client/{oldcedula}', 'clientController@patch');
    Route::post('client', 'clientController@save');

    /*Facturas de venta*/
    Route::get('factura_venta', 'fact_ventController@AllSale');
    Route::post('factura_venta', 'fact_ventController@GuardarFactura');

    /*User*/
    Route::get('user', 'userController@AllUser');
    Route::get('user/{cedula}', 'userController@get');
    Route::post('user', 'userController@save');
    Route::patch('user/{oldcedula}', 'userController@patch');
    Route::delete('user/{cedula}', 'userController@delete');

    /*Provider*/
    Route::get('provider', 'providerController@AllProviders');
    Route::get('provider/{rif}', 'providerController@get');
    Route::patch('provider/{oldrif}', 'providerController@patch');
    Route::post('provider', 'providerController@save');

    /*Product*/
    Route::get('product', 'productController@AllProducts');
    Route::get('product_search', 'productController@SearchProduct');
    Route::get('product/{codigo}', 'productController@get');
    Route::patch('product/{oldcodigo}', 'productController@patch');
    Route::post('product', 'productController@save');

    /*Roles*/
    Route::get('role','roleController@All');

    /*Profile*/
    Route::get('profile', 'profileController@get');

});
