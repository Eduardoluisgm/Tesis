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
        if (authUser.isLogin()) {
          profile.getFresh(
            function(data) {
              vm.profile=data;
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

      $rootScope.$on('UpdateProfile', function() {
          getProfile();
      });


  };
