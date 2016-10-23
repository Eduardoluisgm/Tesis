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
      console.log("Menu Controller");


      /*Si estoy Logeado*/
      if (authUser.isLogin()) {
        profile.get(
          function(data) {
            vm.profile=data;
          }, function (err) {
          });
      }

      /*Me estoy deslogueando*/
      function logout() {
        authUser.logout();
      }

      $rootScope.$on('MenuProfile', function() {
        console.log("cargando menu y show menu");
        profile.get(
          function(data) {
            vm.profile=data;
          }, function (err) {
          });
          vm.showMenu = true;
      });

      $rootScope.$on('HideMenu', function() {
          vm.showMenu = false;
      });


  };
