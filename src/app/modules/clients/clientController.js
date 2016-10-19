'use strict';

angular.module('frontEndApp')
  .controller('clientController', clientController)
  .controller('ClientInformationController', ClientInformationController)
  .controller('ClientCreateController',ClientCreateController);

  function clientController (client,$q,$uibModal, $rootScope) {
      var vm = this;
      vm.changePage=changePage;
      vm.openCreate = openCreate;
      vm.openInformation = openInformation;
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

      $rootScope.$on('changeClient', function() {
        console.log("Cambiando usuario");
        changePage(vm.pagination.current_page);
      });
  };

  function ClientInformationController ($uibModalInstance,$q, $rootScope, clientResource, client_id) {
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
      'telefono':""
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function () {
      vm.isloading = true;
      console.log(vm.client);
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
  }
