'use strict';

angular.module('frontEndApp')
  .controller('profileController', profileController);

  function profileController ($log,profile, authUser,$rootScope,toastr, userUpdate) {
      var vm = this;
      vm.profile = [];
      vm.name=
      vm.saveProfile = saveProfile;
      vm.isloading = false;

      profile.get(
        function(data) {
          vm.profile=data;
          vm.name=vm.profile.name;
          vm.profile.password = "";
          vm.profile.confirm_password ="";
          vm.profile.oldcedula = vm.profile.cedula;
          console.log(vm.profile);
        }, function (err) {
      });

      function saveProfile () {
        vm.isloading= true;
        console.log(vm.profile);
        if (vm.profile.password==vm.profile.confirm_password) {
          userUpdate.patch(vm.profile,
            function (data) {
              toastr.success("Perfil actualizado exitosamente");
              $rootScope.$broadcast('UpdateProfile');
              vm.name=vm.profile.name;
              vm.isloading = false;
            },
            function (err) {
              if (err.status==409) {
                toastr.info("Ya existe un usuario con esa cedula", "Información");
              }
              vm.isloading = false;
            });
        } else {
          vm.isloading = false;
          toastr.warning('Las contraseñas no coinciden','Advertencia');
        }

      }

      /*Evitar que la cedula comienze con cero*/
      vm.changeCedula = function () {
        if (vm.profile.cedula) {
          vm.profile.cedula = parseInt(vm.profile.cedula);
        }
      }

      /*Solo permite numeros*/
      vm.solonumeros = function(event) {
        if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
          event.preventDefault();
        }
      }
  };
