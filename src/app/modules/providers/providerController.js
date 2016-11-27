'use strict';

angular.module('frontEndApp')
  .controller('providerController', providerController)
  .controller('ProviderInformationController', ProviderInformationController)
  .controller('ProviderEditController', ProviderEditController)
  .controller('ProviderCreateController',ProviderCreateController);

  function providerController (provider,$q,$uibModal, $rootScope, providerEdit, toastr) {
      var vm = this;
      vm.changePage=changePage;
      vm.openCreate = openCreate;
      vm.openEdit = openEdit;
      vm.openInformation = openInformation;
      vm.changeStatus= changeStatus;
      vm.listaProveedores = [];
      vm.pagination = [];

      cargar();

      function cargar () {
        var proveedores = provider.getFresh({page:1});
        $q.all([proveedores.$promise]).then(function(data){
            vm.listaProveedores = data[0].data;
            console.log(data[0].data);
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      function changeStatus(rif, status) {
        if (status==1) {
          status= "0";
        } else {
          status= "1";
        }
        providerEdit.patch({
          'rif':rif,
          'oldrif':rif,
          'status':status
        }, function (data) {
            changePage(vm.pagination.current_page);
            toastr.success("Cambio de estado exitoso", "Información");
        }, function (err) {})
      }

      function changePage (number) {
        var proveedores = provider.getFresh({page:number});
        $q.all([proveedores.$promise]).then(function(data){
            vm.listaProveedores = data[0].data; /*aqui habias dejado lista clientes*/
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
          templateUrl: 'partials/Modal_Provider.html', /*Llamo al template donde usare lamodal*/
          controller: 'ProviderCreateController', /*nombre del controlador de la modal*/
          controllerAs: 'vm', /*Importante colocar esto*/
          resolve: {
            origin: function () {
              return {
                'origin':'provider'
              };
            }
          }
        });
      }

      function openInformation (provider) {
        console.log("ver informacion ", provider);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Provider.html', /*Llamo al template donde usare lamodal*/
          controller: 'ProviderInformationController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: {
            provider_id: function () {
              return provider.rif;
            }
          }
        });
      }

      /*Abre la modal de editar usuario*/
      function openEdit (rif) {
        console.log("ver informacion ", rif);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Provider.html', /*Llamo al template donde usare lamodal*/
          controller: 'ProviderEditController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: { /*asi se pasa un parametro**/
            provider_id: function () {
              return rif;
            }
          }
        });
      }

      $rootScope.$on('changeProvider', function() {
        console.log("Cambiando Proveedor");
        changePage(vm.pagination.current_page);
      });
  };

  /*Modal editar Usuario*/
  function ProviderEditController ($uibModalInstance,$q, $rootScope, provider_id ,providerResource, providerEdit, toastr) {
    var vm = this;
    vm.status = "actualizar";
    vm.isloading = false;
    vm.provider= [];
    cargar();
    function cargar() {
      var proveedor = providerResource.getFresh({'rif':provider_id});
      $q.all([proveedor.$promise]).then(function(data){
        vm.provider = data[0];
        vm.provider.oldrif = vm.provider.rif;
      });
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function () {
      vm.isloading = true;
        providerEdit.patch(vm.provider,
          function (data) {
            vm.isloading = false;
            toastr.success("Proveedor actualizado correctamente", "Información");
            $rootScope.$broadcast('changeProvider');
            $uibModalInstance.dismiss('cancel');
          },
          function (err) {
            if (err.status==409) {
              toastr.info("Ya existe un proveedor con ese rif", "Información");
            }
            vm.isloading = false;
          })
    }

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }
    vm.changeRif = function () {
      if (vm.provider.rif) {
        vm.provider.rif = parseInt(vm.provider.rif);
      }
    }
  }

  function ProviderInformationController ($uibModalInstance,$q, $rootScope, providerResource, toastr, provider_id) {
    var vm= this;
    vm.status="ver";
    vm.provider= [];
    console.log("provider id "+ provider_id);

    providerResource.getFresh({
      'rif': provider_id
    }, function (data) {
        vm.provider = data;
        console.log(vm.provider);
    }, function (err) {
    });

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }

  function ProviderCreateController ($uibModalInstance,$q,provider,toastr, $rootScope, origin) {
    var vm = this;
    console.log(origin);
    vm.status="crear";
    vm.isloading = false;
    vm.provider = {
      'rif':"",
      'nombre':"",
      'nombre_vendedor':"",
      'direccion':"",
      'telefono':""
    }

    if (origin.origin=="buy") {
      vm.provider.rif = origin.rif;
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function () {
      console.log("estoy guardando");
      vm.isloading = true;
      vm.provider.rif = parseInt(vm.provider.rif);
      provider.save(vm.provider,
          function (data) {
            toastr.success("Proveedor registrado exitosamente");
            if (origin.origin=="provider") {
              $rootScope.$broadcast('changeProvider');
            }

            if (origin.origin=="buy") {
              $rootScope.$broadcast('Buy_create_provider', {'data':data});
            }

            $uibModalInstance.dismiss('cancel');
            vm.isloading = false;
          }, function (err)  {
            if (err.status==409) {
              toastr.info("Ya existe un proveedor con ese rif", "Información");
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
    vm.changeRif = function () {
      if (vm.provider.rif) {
        vm.provider.rif = parseInt(vm.provider.rif);
      }
    }
  }
