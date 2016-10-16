'use strict';

angular.module('frontEndApp')
  .controller('loginController', loginController);

  function loginController ($log, authUser,$rootScope) {
      var vm = this;
      vm.login = login;
      vm.isloading = false;
      vm.credential = {
        'cedula': "",
        'password': ""
      };

      /*hace la peticion al login*/
      function login () {
        vm.isloading= true;
        authUser.loginApi(vm.credential);
      };

      $rootScope.$on('errorLogin', function() {
        vm.isloading = false;
      });

      $rootScope.$broadcast('HideMenu');
  };
