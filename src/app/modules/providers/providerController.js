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
        var proveedores = provider.get({page:1});
        $q.all([proveedores.$promise]).then(function(data){
            vm.listaProveedores = data[0].data;
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

      function changePage (number) {
        if (vm.status=="Normal") {
          var proveedores = provider.getFresh({page:number});
          $q.all([proveedores.$promise]).then(function(data){
              vm.listaProveedores = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Normal";
              vm.Buscar.buscando=false;
          });
        }
        if (vm.status=="Busqueda") {
          var proveedores = provider.getFresh({page:number,'search': vm.Buscar.busqueda});
          $q.all([proveedores.$promise]).then(function(data){
              vm.listaProveedores = data[0].data;
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
      console.log("rif que estoy pidiendo "+ provider_id);
      providerResource.getFresh({'rif':provider_id},
        function (data) {
          vm.provider = data;
          vm.provider.oldrif = vm.provider.rif;
          vm.provider.rif = vm.provider.rif.slice(2);
          console.log("proveedor",vm.provider);
        }, function (err) {
        }
      );
    }
    vm.ListType = [
      {'sigla':"V", 'nombre' : 'Venezolano'},
      {'sigla':"J", 'nombre' : 'Jurídico'},
      {'sigla':"E", 'nombre' : 'Extranjero'},
      {'sigla':'G', 'nombre' : 'Gubernamental'}
    ]

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
    ////
    vm.save = function () {
      vm.isloading = true;
      vm.ListType.forEach(function(data){
          if (data.nombre==vm.provider.tipo) {
            vm.provider.rif = data.sigla +"-"+vm.provider.rif;
          }
      });
        providerEdit.patch(vm.provider,
          function (data) {
            vm.isloading = false;
            toastr.success("Proveedor actualizado correctamente", "Información");
            $rootScope.$broadcast('changeProvider');
            $uibModalInstance.dismiss('cancel');
          },
          function (err) {
            if (err.status==409) {
              toastr.info("Ya existe un proveedor con ese identificador", "Información");
            }
            console.log("estoy comentiendo un error");
            vm.provider.rif =  vm.provider.rif.slice(2);
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
      'tipo':"Venezolano",
      'nombre_vendedor':"",
      'telefono':"",
      'direccion':""
    };
    vm.ListType = [
      {'sigla':"V", 'nombre' : 'Venezolano'},
      {'sigla':"J", 'nombre' : 'Jurídico'},
      {'sigla':"E", 'nombre' : 'Extranjero'},
      {'sigla':'G', 'nombre' : 'Gubernamental'}
    ]

    if (origin.origin=="buy") {
      vm.provider.rif = origin.rif;
    }


    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function () {
      vm.isloading = true;
      vm.ListType.forEach(function(data){
          if (data.nombre==vm.provider.tipo) {
            vm.provider.rif = data.sigla +"-"+vm.provider.rif;
          }
      });
      provider.save(vm.provider,
          function (data) {
            toastr.success("proveedor registrado exitosamente");
            if (origin.origin=="provider") {
              console.log("estoy guardando desde el proveedor");
              $rootScope.$broadcast('changeProvider');
            };
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
