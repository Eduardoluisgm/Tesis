'use strict';

angular.module('frontEndApp')
  .controller('usersController', usersController)
  .controller('UserInformationController', UserInformationController)
  .controller('UserEditController',UserEditController)
  .controller('UserCreateController', UserCreateController);

  function usersController (user,$uibModal,$q,$log,authUser, $rootScope, userDeleted, toastr, userUpdate) {
      var vm = this;
      vm.cargar = cargar;
      vm.openCreate = openCreate;
      vm.openInformation = openInformation;
      vm.openEdit = openEdit;
      vm.listaUsuarios = [];
      vm.pagination = [];
      vm.profile= authUser.profile();
      vm.changePage = changePage;
      vm.changeStatus = changeStatus;
      vm.reload = reload;
      vm.search = search;
      vm.status = "Normal";
      vm.Buscar = {
        'busqueda':"",
        'actual':"",
        'buscando': false
      };
      cargar();

      /*Funcion que se ejecuta por primera vez*/
      function cargar () {
        var users = user.getFresh({page:1});
        console.log("Estoy cargando");
        $q.all([users.$promise]).then(function(data){
          console.log(data[0].data);
            vm.listaUsuarios = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }


      /*funcion para buscar*/
      function search () {
        if (vm.Buscar.actual) {
          vm.Buscar.busqueda = vm.Buscar.actual;
          vm.status = "Busqueda";
          changePage(1);
        }
        console.log(vm.Buscar);
      }

      /*recarga todo al principio*/
      function reload () {
        vm.Buscar.busqueda = "";
        vm.status = "Normal";
        changePage(1);
      }

      /*Cambio de pagina*/
      function changePage (number) {
        if (vm.status=="Normal") {
          var users = user.getFresh({page:number});
          $q.all([users.$promise]).then(function(data){
              vm.listaUsuarios = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Normal";
              vm.Buscar.buscando=false;
          });
        }

        if (vm.status=="Busqueda") {
          var users = user.getFresh({page:number, 'search': vm.Buscar.busqueda});
          $q.all([users.$promise]).then(function(data){
              vm.listaUsuarios = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Busqueda";
              vm.Buscar.buscando=true;
          });
        }

      }

      function changeStatus(cedula, status) {
        if (status==1) {
          status= "0";
        } else {
          status= "1";
        }

        console.log("nuevo status "+ status);
        userUpdate.patch({
          'cedula': cedula,
          'oldcedula': cedula,
          'status': status
          },function (data) {
              toastr.success("Cambio de estado exitoso");
              changePage(vm.pagination.current_page);
          },function (err) {
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
      function openInformation (cedula) {
        console.log("ver informacion ", cedula);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_User.html', /*Llamo al template donde usare lamodal*/
          controller: 'UserInformationController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: {
            user_id: function () {
              return cedula;
            }
          }
        });
      }

      /*Abre la modal de editar usuario*/
      function openEdit (cedula) {
        console.log("ver informacion ", cedula);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_User.html', /*Llamo al template donde usare lamodal*/
          controller: 'UserEditController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: { /*asi se pasa un parametro**/
            user_id: function () {
              return cedula;
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

    /*Evitar que la cedula comienze con cero*/
    vm.changeCedula = function () {
      if (vm.user.cedula) {
        vm.user.cedula = parseInt(vm.user.cedula);
      }
    }
  }

  /*Modal de Informaci'on de Usuario*/
  function UserInformationController ($uibModalInstance,$q, user_id, userGet) {
    var vm = this;
    vm.status= "ver";
    console.log("ya en modal ", user_id);

    userGet.getFresh({'cedula': user_id},
      function (data) {
        vm.user=data;
      },
      function (err) {
      });

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }

  function UserEditController ($uibModalInstance,$q, user_id, userGet,role,toastr,userUpdate, $rootScope) {
    var vm = this;
    vm.status= "actualizar";
    vm.openDate = false;
    vm.isloading = false;
    cargar();

    function cargar() {
      var usuario = userGet.get({'cedula': user_id});
      var roles = role.query();
      $q.all([usuario.$promise, roles.$promise]).then(function(data){
         vm.user = data[0];
         vm.user.oldcedula = vm.user.cedula;
         vm.listaroles= data[1];
         vm.user.start_date = new Date(vm.user.fecha_ingreso);
         console.log(data[0]);
      });
    }

    vm.open_fecha_ingreso = function() {
      vm.openDate = !vm.openDate;
    };

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

    /*Evitar que la cedula comienze con cero*/
    vm.changeCedula = function () {
      if (vm.user.cedula) {
        vm.user.cedula = parseInt(vm.user.cedula);
      }
    }

    /*Solo permite numeros*/
    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }



    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  };
