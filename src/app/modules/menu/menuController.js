'use strict';

angular.module('frontEndApp')
  .controller('MenuController', MenuController);

  function MenuController ($rootScope, $scope, profile, authUser) {
      var vm = this;
      vm.showMenu = true;
      vm.logout = logout;
      vm.miscelaneoOpen=false; /*dropdow de miscelaneos*/
      vm.name = "Caguita";
      vm.profile = "";


      getProfile();

      function getProfile() {
        vm.rol = localStorage.getItem('role_id');
        if (authUser.isLogin()) {
          profile.getFresh(
            function(data) {
              vm.profile=data;
              vm.rol = vm.profile.role_id;
              localStorage.setItem('role_id', vm.rol);
              console.log("rol del perfil: ", vm.rol);
            }, function (err) {
            });
        }
      }
      /*Si estoy Logeado*/




      /*Me estoy deslogueando*/
      function logout() {
        authUser.logout();
      }

      $rootScope.$on('MenuProfile', function() {
        profile.get(
          function(data) {
            vm.profile=data;
          }, function (err) {
          });
          vm.showMenu = true;
      });


      $rootScope.$on('GetRol', function () {
        vm.rol = localStorage.getItem('role_id');
        console.log ("rol para el menu "+ vm.rol);
      });

      $rootScope.$on('HideMenu', function() {
          vm.showMenu = false;
      });

      $rootScope.$on('UpdateProfile', function() {
          getProfile();
      });


  };
