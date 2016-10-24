'use strict';

angular.module('frontEndApp')
  .controller('profileController', profileController);

  function profileController ($log,profile, authUser,$rootScope) {
      var vm = this;
      vm.profile = [];
      console.log("estoy en el perfil");
      profile.get(
        function(data) {
          vm.profile=data;
          console.log(vm.profile);
        }, function (err) {
      });
  };
