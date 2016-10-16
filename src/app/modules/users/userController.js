'use strict';

angular.module('frontEndApp')
  .controller('usersController', usersController)
  .controller('UserInformationController', UserInformationController)
  .controller('UserEditController',UserEditController)
  .controller('UserCreateController', UserCreateController);

  function usersController (user,$uibModal,$q,$log,authUser, $rootScope, userDeleted, toastr) {
      var vm = this;
      vm.cargar = cargar;
      vm.openCreate = openCreate;
      vm.openInformation = openInformation;
      vm.openEdit = openEdit;
      vm.listaUsuarios = [];
      vm.pagination = [];
      vm.profile= authUser.profile();
      console.log(vm.profile);
      vm.changePage = changePage;
      vm.DeleteUser = DeleteUser;
      cargar();

      /*Funcion que se ejecuta por primera vez*/
      function cargar () {
        var users = user.get({page:1});
        $q.all([users.$promise]).then(function(data){
            vm.listaUsuarios = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      /*Cambio de pagina*/
      function changePage (number) {
        var users = user.get({page:number});
        $q.all([users.$promise]).then(function(data){
            vm.listaUsuarios = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      function DeleteUser(cedula) {
          userDeleted.delete({'cedula':cedula},
            function (data) {
              toastr.success("Usuario Eliminado con exito");
              changePage(vm.pagination.current_page);
            }, function (err) {
          });
      };

      /*Abre la modal de crear usuario*/
      function openCreate () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_User.html', /*Llamo al template donde usare lamodal*/
          controller: 'UserCreateController', /*nombre del controlador de la modal*/
          controllerAs: 'vm' /*Importante colocar esto*/
        });
      }

      /*Abre la modal de crear usuario*/
      function openInformation (user) {
        console.log("ver informacion ", user);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_User.html', /*Llamo al template donde usare lamodal*/
          controller: 'UserInformationController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: {
            user: function () {
              return user;
            }
          }
        });
      }

      /*Abre la modal de editar usuario*/
      function openEdit (user) {
        console.log("ver informacion ", user);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_User.html', /*Llamo al template donde usare lamodal*/
          controller: 'UserEditController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: {
            user: function () {
              return user;
            }
          }
        });
      }


      $rootScope.$on('changeUser', function() {
        console.log("Cambiando usuario");
        changePage(vm.pagination.current_page);
      });
  };

  /*Modal de crear Usuario*/
  function UserCreateController ($uibModalInstance,$q,role, toastr,user, $rootScope) {
    var vm = this;
    vm.status="crear";
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
            $rootScope.$broadcast('changeUser');
            $uibModalInstance.dismiss('cancel');
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

  /*Modal de Informaci'on de Usuario*/
  function UserInformationController ($uibModalInstance,$q, user) {
    var vm = this;
    vm.user = user;
    vm.status= "ver";
    console.log("ya en modal ", vm.user);

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }

  function UserEditController ($uibModalInstance,$q, user, userGet,role,toastr,userUpdate, $rootScope) {
    var vm = this;
    vm.status= "actualizar";
    vm.isloading = false;
    cargar();

    function cargar() {
      var usuario = userGet.get({'cedula': user.cedula});
      var roles = role.query();
      $q.all([usuario.$promise, roles.$promise]).then(function(data){
         vm.user = data[0];
         vm.user.oldcedula = vm.user.cedula;
         vm.listaroles= data[1];
         vm.user.start_date = new Date(vm.user.fecha_ingreso);
         console.log(data[0]);
      });
    }

    vm.save = function() {
      vm.isloading = true;
      if (vm.user.password==vm.user.confirm_password) {
        vm.user.fecha_ingreso = moment(vm.user.start_date).format('YYYY-MM-DD HH:mm');
        userUpdate.patch(vm.user,
          function (data) {
            toastr.success("Usuario actualizado exitosamente");
            $rootScope.$broadcast('changeUser');
            $uibModalInstance.dismiss('cancel');
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
      console.log(vm.user);
    }



    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  };
