'use strict';

angular.module('frontEndApp')
  .controller('loginController', loginController);

  function loginController ($log, authUser) {
      var vm = this;
      vm.login = login;
      vm.credential = {
        'cedula': "",
        'password': ""
      };

      /*hace la peticion al login*/
      function login () {
        authUser.loginApi(vm.credential);
      };
  };
