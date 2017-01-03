'use strict';

angular.module('frontEndApp')
  .controller('clientController', clientController)
  .controller('ClientInformationController', ClientInformationController)
  .controller('ClientEditController', ClientEditController)
  .controller('ClientCreateController',ClientCreateController);

  function clientController (client,$q,$uibModal, $rootScope, clientEdit, toastr) {
      var vm = this;
      vm.changePage=changePage;
      vm.openCreate = openCreate;
      vm.openEdit = openEdit;
      vm.openInformation = openInformation;
      vm.changeStatus= changeStatus;
      vm.listaClientes = [];
      vm.pagination = [];
      vm.reload = reload;
      vm.search = search;
      vm.status = "Normal";
      vm.Buscar = {
        'busqueda':"",
        'actual':"",
        'buscando': false
      }

      cargar();

      function cargar () {
        var clientes = client.get({page:1});
        $q.all([clientes.$promise]).then(function(data){
            vm.listaClientes = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      function changeStatus(cedula, status) {
        if (status==1) {
          status= "0";
        } else {
          status= "1";
        }
        clientEdit.patch({
          'cedula':cedula,
          'oldcedula':cedula,
          'status':status
        }, function (data) {
            changePage(vm.pagination.current_page);
            toastr.success("Cambio de estado exitoso", "Información");
        }, function (err) {})
      }



      /*funcion para buscar*/
      function search () {
        if (vm.Buscar.actual) {
          vm.Buscar.busqueda = vm.Buscar.actual;
          vm.status = "Busqueda";
          console.log("entre aqui")
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

      function changePage (number) {
        if (vm.status=="Normal") {
          var clientes = client.getFresh({page:number});
          $q.all([clientes.$promise]).then(function(data){
              vm.listaClientes = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Normal";
              vm.Buscar.buscando=false;
          });
        }
        console.log("status "+ vm.status);
        if (vm.status=="Busqueda") {
          var clientes = client.getFresh({page:number, 'search': vm.Buscar.busqueda});
          $q.all([clientes.$promise]).then(function(data){
              vm.listaClientes = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Busqueda";
              vm.Buscar.buscando=true;
          });
        }
      }

      /*Abre la modal de crear usuario*/
      function openCreate () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Client.html',
          controller: 'ClientCreateController',
          controllerAs: 'vm',
          resolve: {
            origin: function () {
              return {
                'origin':'client'
              };
            }
          }
        });
      }

      function openInformation (client) {
        console.log("ver informacion ", client);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Client.html', /*Llamo al template donde usare lamodal*/
          controller: 'ClientInformationController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: {
            client_id: function () {
              return client.cedula;
            }
          }
        });
      }

      /*Abre la modal de editar usuario*/
      function openEdit (cedula) {
        console.log("ver informacion ", cedula);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Client.html', /*Llamo al template donde usare lamodal*/
          controller: 'ClientEditController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: { /*asi se pasa un parametro**/
            client_id: function () {
              return cedula;
            }
          }
        });
      }

      $rootScope.$on('changeClient', function() {
        console.log("Cambiando usuario");
        changePage(vm.pagination.current_page);
      });
  };

  /*Modal editar Usuario*/
  function ClientEditController ($uibModalInstance,$q, $rootScope, client_id ,clientResource, clientEdit, toastr) {
    var vm = this;
    vm.status = "actualizar";
    vm.isloading = false;
    vm.client= [];
    vm.ListType = [
      {'sigla':"V", 'nombre' : 'Venezolano'},
      {'sigla':"J", 'nombre' : 'Jurídico'},
      {'sigla':"E", 'nombre' : 'Extranjero'},
      {'sigla':'G', 'nombre' : 'Gubernamental'}
    ]
    cargar();
    function cargar() {
      var cliente = clientResource.getFresh({'cedula':client_id});
      $q.all([cliente.$promise]).then(function(data){
        vm.client = data[0];
        vm.client.oldcedula = vm.client.cedula;
        vm.client.cedula = vm.client.cedula.slice(2);
        console.log("Cliente ", vm.client.tipo);
      });
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
    ////
    vm.save = function () {
      vm.isloading = true;
      vm.ListType.forEach(function(data){
          if (data.nombre==vm.client.tipo) {
            vm.client.cedula = data.sigla +"-"+vm.client.cedula;
          }
      });
        clientEdit.patch(vm.client,
          function (data) {
            vm.isloading = false;
            toastr.success("Cliente actualizado correctamente", "Información");
            $rootScope.$broadcast('changeClient');
            $uibModalInstance.dismiss('cancel');
          },
          function (err) {
            if (err.status==409) {
              toastr.info("Ya existe un cliente con ese identificador", "Información");
            }
            console.log("estoy comentiendo un error");
            vm.client.cedula =  vm.client.cedula.slice(2);
            vm.isloading = false;
          })
    }

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }
    vm.changeCedula = function () {
      if (vm.client.cedula) {
        vm.client.cedula = parseInt(vm.client.cedula);
      }
    }
  }

  function ClientInformationController ($uibModalInstance,$q, $rootScope, clientResource, toastr, client_id) {
    var vm= this;
    vm.status="ver";
    vm.client= [];
    console.log("client id "+ client_id);

    clientResource.getFresh({
      'cedula': client_id
    }, function (data) {
        vm.client = data;
        console.log(vm.client);
    }, function (err) {
    });

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }

  function ClientCreateController ($uibModalInstance,$q,client,toastr, $rootScope, origin) {
    var vm = this;
    console.log(origin);
    vm.status="crear";
    vm.isloading = false;
    vm.client = {
      'cedula':"",
      'name':"",
      'apellido':"",
      'direccion':"",
      'telefono':"",
      'tipo': "Venezolano"
    };
    vm.ListType = [
      {'sigla':"V", 'name' : 'Venezolano'},
      {'sigla':"J", 'name' : 'Jurídico'},
      {'sigla':"E", 'name' : 'Extranjero'},
      {'sigla':'G', 'name' : 'Gubernamental'}
    ]

    if (origin.origin=="sell") {
      console.log("vengo de  vender");
      vm.client.cedula = origin.cedula,
      vm.client.tipo = origin.tipo
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function () {
      vm.isloading = true;
      vm.ListType.forEach(function(data){
          if (data.name==vm.client.tipo) {
            vm.client.cedula = data.sigla +"-"+vm.client.cedula;
          }
      });
      client.save(vm.client,
          function (data) {
            toastr.success("Usuario registrado exitosamente");
            if (origin.origin=="client") {
              console.log("estoy guardando desde el cliente");
              $rootScope.$broadcast('changeClient');
            };
            if (origin.origin=="sell") {
              console.log(data);
              console.log("estoy guardando desde el vender");
              $rootScope.$broadcast('Sell_create_client', {'data':data});
            };

            $uibModalInstance.dismiss('cancel');
            vm.isloading = false;
          }, function (err)  {
            if (err.status==409) {
              toastr.info("Ya existe un usuario con esa cedula", "Información");
              vm.client.cedula = vm.client.cedula.slice(2);
            }
            vm.isloading = false;
          }
      )
    }

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }

    /*Evitar que la cedula comienze con cero*/
    vm.changeCedula = function () {
      if (vm.client.cedula) {
        vm.client.cedula = parseInt(vm.client.cedula);
      }
    }
  }
