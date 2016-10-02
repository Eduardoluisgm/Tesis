'use strict';

angular.module('frontEndApp')
  .controller('usersController', usersController)
  .controller('UserCreateController', UserCreateController);

  function usersController (user,$uibModal,$q,$log) {
      var vm = this;
      vm.cargar = cargar;
      vm.openCreate = openCreate;
      vm.listaUsuarios = [];
      cargar();

      /*Funcion que se ejecuta por primera vez*/
      function cargar () {
        var users = user.get({page:1});
        $q.all([users.$promise]).then(function(data){
            console.log(data[0]);
            vm.listaUsuarios = data[0].data;
        });
      }

      /*Abre la modal de crear usuario*/
      function openCreate () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_user_create.html', /*Llamo al template donde usare lamodal*/
          controller: 'UserCreateController', /*nombre del controlador de la modal*/
          controllerAs: 'vm' /*Importante colocar esto*/
        });
      }
  };

  /*Modal de crear Usuario*/
  function UserCreateController ($uibModalInstance,$q,role) {
    var vm = this;
    vm.openDate = false; /*Verifica que el calendario este cerrado*/
    vm.listaroles= [];
    cargar();
    vm.user = {
      'cedula':"23591017",
      'name':"",
      'email': "",
      'password':"",
      'confirm_password':"",
      'direccion':"",
      'telefono':"",
      'fecha_ingreso': new Date(),
      'rol_id':1
    }

    function cargar () {
      var roles = role.query();
      $q.all([roles.$promise]).then(function(data){
        vm.listaroles= data[0];
        console.log("roles", vm.listaroles);
      });
    }

    /*funcion que abre y cierra el caendario*/
    vm.open_fecha_ingreso = function() {
      vm.openDate = !vm.openDate;
    };

    /*Guarda el usuario*/
    vm.save = function () {
      console.log(vm.user);
    }
    /*Cierra la modal*/
    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
