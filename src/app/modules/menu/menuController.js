'use strict';

angular.module('frontEndApp')
  .controller('MenuController', MenuController);

  function MenuController ($rootScope, $scope, profile) {
      var vm = this;
      vm.name = "Caguita";
      vm.profile = "";
      console.log("Menu Controller");

      $rootScope.$on('MenuProfile', function() {
        console.log("rootscope");
        profile.get(
          function(data) {
            vm.profile=data;
            console.log(vm.profile);
          }, function (err) {

          });
      });

  };
