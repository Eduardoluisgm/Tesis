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

      function changePage (number) {
        var clientes = client.getFresh({page:number});
        $q.all([clientes.$promise]).then(function(data){
            vm.listaClientes = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      /*Abre la modal de crear usuario*/
      function openCreate () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Client.html', /*Llamo al template donde usare lamodal*/
          controller: 'ClientCreateController', /*nombre del controlador de la modal*/
          controllerAs: 'vm' /*Importante colocar esto*/
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
    cargar();
    function cargar() {
      var cliente = clientResource.getFresh({'cedula':client_id});
      $q.all([cliente.$promise]).then(function(data){
        vm.client = data[0];
        vm.client.oldcedula = vm.client.cedula;
        vm.client.cedula = vm.client.cedula.slice(2);
      });
    }
    vm.ListType = [
      {'sigla':"V", 'name' : 'Venezolano'},
      {'sigla':"J", 'name' : 'Jurídico'},
      {'sigla':"E", 'name' : 'Extranjero'},
      {'sigla':'G', 'name' : 'Gubernamental'}
    ]

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
    ////
    vm.save = function () {
      vm.isloading = true;
      vm.ListType.forEach(function(data){
          if (data.name==vm.client.tipo) {
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

  function ClientCreateController ($uibModalInstance,$q,client,toastr, $rootScope) {
    var vm = this;
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
            $rootScope.$broadcast('changeClient');
            $uibModalInstance.dismiss('cancel');
            vm.isloading = false;
          }, function (err)  {
            if (err.status==409) {
              toastr.info("Ya existe un usuario con esa cedula", "Información");
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
