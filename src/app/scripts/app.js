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
    'ng-currency'
  ])
  .config(function ($routeProvider,$authProvider,ApiUrl) {
    console.log("url del api ", ApiUrl);
    $authProvider.loginUrl = ApiUrl+'/login';
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
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
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope,$location,authUser,toastr, moment){
     moment.locale('es');
     console.log("run");
     var rutasPrivadas= ['/','/about','/client','/user', '/profile', '/provider', '/product', '/sell', '/buy', '/receivable',
     '/payable', '/facturaVenta', '/facturaCompra', '/masVendido'];
     /*rutas que solo puede ver admin y super admin*/
     var rutasAdmin = ['/client', '/user', '/provider', '/product', '/facturaVenta', '/facturaCompra', '/masVendido'];
     /*Rutas que solo ve el super admin*/
     var rutasSuper = ['/user'];
     var rol = "";
      $rootScope.$on('$routeChangeStart', function() {
        rol = localStorage.getItem('role_id');
        if(($.inArray($location.path(),rutasPrivadas)!==-1) && !authUser.isLogin()) {
          toastr.error('Debe estar logueado');
          $location.path('/login');
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
