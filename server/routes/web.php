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

/*Todas las rutas que seran accedidas por app externas colocando el cors ya tienen permiso*/
Route::group(['middleware' => 'cors'], function (){
    /*Login*/
    Route::post('login','ApiAuthController@AuthUser');
    Route::post('message', 'messagesController@save');

    /*Bancos*/
    Route::get('bank', 'bankController@AllBank');
    Route::get('bank_active','bankController@bankActive');

    Route::get('bank/{id}', 'bankController@get');
    Route::patch('bank/{id}', 'bankController@patch');
    Route::post('bank', 'bankController@save');

    /*client*/
    Route::get('client', 'clientController@AllClient');
    Route::get('clientActive', 'clientController@ClientActive');
    Route::get('client/{cedula}', 'clientController@get');
    Route::patch('client/{oldcedula}', 'clientController@patch');
    Route::post('client', 'clientController@save');

    /*Cuentas de bancos*/
    Route::get('cuentas', 'cuentasController@all');
    Route::get('cuentas/{id}', 'cuentasController@get');
    Route::patch('cuentas/{id}', 'cuentasController@update');
    Route::post('cuentas', 'cuentasController@Save');
    Route::delete('cuentas/{id}', 'cuentasController@delete');

    /*cuenta de bancos Pagos*/
    Route::get('cuentas_pagos/{cuenta_id}', 'cuenta_pagosController@getCuentaMovimiento');
    Route::post('cuentas_pagos/{cuenta_id}', 'cuenta_pagosController@Save');
    Route::delete('cuentas_pagos/{id}', 'cuenta_pagosController@delete');

    /*Facturas de venta*/
    Route::get('factura_venta', 'fact_ventController@AllSale');
    Route::get('factura_venta/{id}/pdf', 'fact_ventController@FacturaPdf');
    Route::get('factura_venta/{id}/pagos', 'fact_ventController@Factura_Pagos');
    Route::post('factura_venta/{id}/pagos', 'fact_ventController@AddPagos');
    Route::post('factura_venta', 'fact_ventController@GuardarFactura');
    Route::delete('factura_venta/{id}', 'fact_ventController@delete');

    /*Cuentas por cobrar*/
    Route::get('cuenta_cobrar', 'fact_ventController@Cuenta_cobrar');

    /*Cuentas por Pagar*/
    Route::get('cuenta_pagar', 'fact_compController@Cuenta_pagar');

    /*Facturas de compra*/
    Route::get('factura_compra', 'fact_compController@all');
    Route::get('factura_compra/{id}/pdf', 'fact_compController@FacturaPdf');
    Route::post('factura_compra', 'fact_compController@GuardarFactura');
    Route::post('factura_compra/{id}/pagos', 'fact_compController@AddPagos');
    Route::delete('factura_compra/{id}', 'fact_compController@delete');

    Route::get('message', 'messagesController@all');
    Route::get('message/{id}', 'messagesController@get');
    Route::patch('message/{id}', 'messagesController@update');
    Route::delete('message/{id}', 'messagesController@delete');


    /*Notificaciones*/
    Route::get('notification/min_stock', 'notificationController@stockMinimo');
    Route::get('notification/max_stock', 'notificationController@stockMaximo');
    Route::get('notification/factura_venta_deuda', 'notificationController@FacturaVentaPorCobrar');
    Route::get('notification/factura_compra_deuda', 'notificationController@FacturaCompraPorPagar');


    /*User*/
    Route::get('user', 'userController@AllUser');
    Route::get('user/{cedula}', 'userController@get');
    Route::post('user', 'userController@save');
    Route::patch('user/{oldcedula}', 'userController@patch');
    Route::delete('user/{cedula}', 'userController@delete');

    /*Provider*/
    Route::get('provider', 'providerController@AllProviders');
    Route::get('providerActive', 'providerController@ProviderActive');
    Route::get('provider/{rif}', 'providerController@get');
    Route::get('provider/{rif}/product', 'providerController@Providers_Products');
    Route::patch('provider/{oldrif}', 'providerController@patch');
    Route::post('provider', 'providerController@save');

    /*Product*/
    Route::get('product', 'productController@AllProducts');
    Route::get('productActive', 'productController@ProductActive');
    Route::get('product_search', 'productController@SearchProduct');
    Route::get('product/{codigo}', 'productController@get');
    Route::get('product/{codigo}/provider', 'productController@Product_providers');
    Route::patch('product/{oldcodigo}', 'productController@patch');
    Route::post('product', 'productController@save');

    /*Reportes*/
    Route::get('ClienteVolumenCompras', 'reportController@clientevolumenCompras');
    Route::get('ClientemayoresCompras', 'reportController@clientemayoresCompras');
    Route::get('ProveedorVolumenCompras', 'reportController@proveedorvolumenCompras');
    Route::get('ProveedormayoresCompras', 'reportController@proveedormayoresCompras');
    Route::get('ProductosMasVendido', 'reportController@productomasVendido');
    Route::get('ProductosMasComprado', 'reportController@productomasComprado');

    /*Roles*/
    Route::get('role','roleController@All');

    /*Profile*/
    Route::get('profile', 'profileController@get');
});
