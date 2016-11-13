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
    'mwl.confirm'
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
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope,$location,authUser,toastr){
     var rutasPrivadas= ['/','/about','/client','/user'];
      $rootScope.$on('$routeChangeStart', function() {
          if(($.inArray($location.path(),rutasPrivadas)!==-1) && !authUser.isLogin()) {
            toastr.error('debe estar logueado');
            $location.path('/login');
          }
      });
  });
