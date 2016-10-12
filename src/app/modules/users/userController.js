'use strict';

angular.module('frontEndApp')
  .controller('usersController', usersController)
  .controller('UserCreateController', UserCreateController);

  function usersController (user,$uibModal,$q,$log,authUser) {
      var vm = this;
      vm.cargar = cargar;
      vm.openCreate = openCreate;
      vm.listaUsuarios = [];
      vm.profile= authUser.profile();
      console.log(vm.profile);
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
  function UserCreateController ($uibModalInstance,$q,role, toastr,user) {
    var vm = this;
    vm.openDate = false; /*Verifica que el calendario este cerrado*/
    vm.listaroles= [];
    vm.isloading = false;
    cargar();
    vm.user = {
      'cedula':"",
      'name':"",
      'email': "",
      'password':"",
      'confirm_password':"",
      'direccion':"",
      'telefono':"",
      'fecha_ingreso': new Date(),
      'start_date': new Date(),
      'role_id':2
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
      vm.isloading = true;
      if (vm.user.password==vm.user.confirm_password) {
        vm.user.fecha_ingreso = moment(vm.user.start_date).format('YYYY-MM-DD HH:mm');
        user.save(vm.user,
          function (data) {
            toastr.success("Usuario registrado exitosamente");
            vm.isloading = false;
          },
          function (err) {
            if (err.status==409) {
              toastr.info("Ya existe un usuario con esa cedula", "Información");
            }
            console.log("error",err);
            vm.isloading = false;
          });
      } else {
        vm.isloading = false;
        toastr.warning('Las contraseñas no coinciden','Advertencia');
      }
      console.log(vm.user);
    }
    /*Cierra la modal*/
    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    /*Solo permite numeros*/
    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }
  }
