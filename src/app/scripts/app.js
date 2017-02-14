'use strict';

/**
 * @ngdoc overview
 * @name frontEndApp
 * @description
 * # frontEndApp
 *
 * Main module of the application.
 */
angular
  .module('frontEndApp', [
    'ngAnimate',
    'ngAria',
    'angularMoment',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'satellizer',
    'authService',
    'toastr',
    'ui.bootstrap',
    'angular-ladda',
    'mwl.confirm',
    'ng-currency',
    'chart.js'
  ])
  .config(function ($routeProvider,$authProvider,ApiUrl) {
    console.log("url del api ", ApiUrl);
    $authProvider.loginUrl = ApiUrl+'/login';
    $routeProvider
      .when('/', {
        templateUrl: 'modules/main/main.html',
        controller: 'mainController',
        controllerAs: 'vm'
      })
      .when('/home', {
        templateUrl: 'modules/home/home.html',
        controller: 'homeController',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/client', {
        templateUrl: 'modules/clients/client.html',
        controller: 'clientController',
        controllerAs: 'vm'
      })
      .when('/user', {
        templateUrl: 'modules/users/user.html',
        controller: 'usersController',
        controllerAs: 'vm'
      })
      .when('/bank', {
        templateUrl: 'modules/bank/bank.html',
        controller: 'bankController',
        controllerAs: 'vm'
      })
      .when('/gestionCuentas', {
        templateUrl: 'modules/gestion-cuentas/gestion-cuentas.html',
        controller: 'gestionCuentasController',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: 'modules/login/login.html',
        controller: 'loginController',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: 'modules/profile/profile.html',
        controller: 'profileController',
        controllerAs: 'vm'
      })
      .when('/provider', {
        templateUrl: 'modules/providers/provider.html',
        controller: 'providerController',
        controllerAs: 'vm'
      })
      .when('/product', {
        templateUrl: 'modules/products/product.html',
        controller: 'productController',
        controllerAs: 'vm'
      })
      .when('/sell', {
        templateUrl: 'modules/sell/sell.html',
        controller: 'sellController',
        controllerAs: 'vm'
      })
      .when('/buy', {
        templateUrl: 'modules/buy/buy.html',
        controller: 'buyController',
        controllerAs: 'vm'
      })
      .when('/receivable', {
        templateUrl: 'modules/receivable/receivable.html',
        controller: 'receivableController',
        controllerAs: 'vm'
      })
      .when('/payable', {
        templateUrl: 'modules/payable/payable.html',
        controller: 'payableController',
        controllerAs: 'vm'
      })
      .when('/facturaVenta', {
        templateUrl: 'modules/facturaVenta/facturaVenta.html',
        controller: 'facturaVentaController',
        controllerAs: 'vm'
      })
      .when('/facturaCompra', {
        templateUrl: 'modules/facturaCompra/facturaCompra.html',
        controller: 'facturaCompraController',
        controllerAs: 'vm'
      })
      .when('/masVendido', {
        templateUrl: 'modules/reporte-productomasVendido/productomasVendido.html',
        controller: 'productomasVendidoController',
        controllerAs: 'vm'
      })
      .when('/masComprado', {
        templateUrl: 'modules/reporte-productomasComprado/productomasComprado.html',
        controller: 'productomasCompradoController',
        controllerAs: 'vm'
      })
      .when('/clienteActivo', {
        templateUrl: 'modules/reporte-clientemasActivo/clientemasActivo.html',
        controller: 'clientemasActivoController',
        controllerAs: 'vm'
      })
      .when('/proveedorActivo', {
        templateUrl: 'modules/reporte-proveedormasActivo/proveedormasActivo.html',
        controller: 'proveedormasActivoController',
        controllerAs: 'vm'
      })
      .when('/mensajes', {
        templateUrl: 'modules/messages/messages.html',
        controller: 'MessagesController',
        controllerAs: 'vm'
      })
      .when('/cuentas', {
        templateUrl: 'modules/cuentas/cuentas.html',
        controller: 'CuentasController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope,$location,authUser,toastr, moment){
     moment.locale('es');
     console.log("run");
     var rutasPrivadas= ['/','/about','/client','/user', '/profile', '/provider', '/product', '/sell', '/buy', '/receivable',
     '/payable', '/facturaVenta', '/facturaCompra', '/masVendido', '/clienteActivo', '/proveedorActivo', '/masComprado', '/bank',
     '/mensajes','/cuentas', 'gestionCuentasController'];
     /*rutas que solo puede ver admin y super admin*/
     var rutasAdmin = ['/client', '/user', '/provider', '/product', '/facturaVenta', '/facturaCompra', '/masVendido','/clienteActivo',
      '/proveedorActivo', '/masComprado', '/bank', '/mensajes','/cuentas'];
     /*Rutas que solo ve el super admin*/
     var rutasSuper = ['/user'];
     var rol = "";
     var session ="";
      $rootScope.$on('$routeChangeStart', function() {
        rol = localStorage.getItem('role_id');
        session = localStorage.getItem('session');
        console.log("Session:  "+ session)
        if(($.inArray($location.path(),rutasPrivadas)!==-1) && !session) {
          $location.path('/home');
          return;
        }
        /*si es un vendedor no puede acceder a las rutas de miscelaneos*/
        if (rol=="3" && $.inArray($location.path(),rutasAdmin)!==-1) {
          toastr.error('Acceso Denegado');
          $location.path('/');
        }

        if (rol=="2" && $.inArray($location.path(),rutasSuper)!==-1) {
          toastr.error('Acceso Denegado');
          $location.path('/');
        }
        $rootScope.$broadcast('GetRol');
      });

  });
