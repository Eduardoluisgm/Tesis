'use strict';

angular.module('frontEndApp')
  .controller('BankCreateController', BankCreateController)
  .controller('BankEditController', BankEditController)
  .controller('bankController', bankController);

  function bankController ($log,$rootScope, toastr, $uibModal, bank, $q, bankResource) {
    var vm = this;
    console.log("Bancos controllador");
    vm.listaBancos = [];
    vm.pagination = [];
    vm.openCreate = openCreate;
    vm.openEdit = openEdit;
    vm.changePage=changePage;
    vm.changeStatus= changeStatus;
    vm.search = search;
    vm.reload = reload;
    vm.status = "Normal";
    vm.Buscar = {
      'busqueda':"",
      'actual':"",
      'buscando': false
    }

    cargar();

    function cargar () {
      var bancos = bank.getFresh({page:1});
      $q.all([bancos.$promise]).then(function(data){
          vm.listaBancos = data[0].data;
          vm.pagination.current_page = data[0].current_page;
          vm.pagination.per_page = data[0].per_page;
          vm.pagination.total = data[0].total;
          vm.pagination.last_page = data[0].last_page;
          console.log("Lista de bancos ", vm.listaBancos);
      });
    }

    /*recarga todo al principio*/
    function reload () {
      vm.Buscar.busqueda = "";
      vm.status = "Normal";
      changePage(1);
    }

    function search () {
      if (vm.Buscar.actual) {
        vm.Buscar.busqueda = vm.Buscar.actual;
        vm.status = "Busqueda";
        console.log("entre aqui")
        changePage(1);
      }
      console.log(vm.Buscar);
    }

    function changeStatus(id, status) {
      if (status==1) {
        status= "0";
      } else {
        status= "1";
      }
      bankResource.patch({
        'id':id,
        'status':status
      }, function (data) {
          changePage(vm.pagination.current_page);
          toastr.success("Cambio de estado exitoso", "Información");
      }, function (err) {})
    }

    function changePage (number) {
      if (vm.status=="Normal") {
        var banco = bank.getFresh({page:number});
        $q.all([banco.$promise]).then(function(data){
            vm.listaBancos = data[0].data;
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
        var banco = bank.getFresh({page:number, 'search': vm.Buscar.busqueda});
        $q.all([banco.$promise]).then(function(data){
            vm.listaBancos = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Busqueda";
            vm.Buscar.buscando=true;
        });
      }
    }

    /*Abre la modal de crear Banco*/
    function openCreate () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Bank.html',
        controller: 'BankCreateController',
        controllerAs: 'vm',
        resolve: {
          origin: function () {
            return {
              'origin':'bank'
            };
          }
        }
      });
    }

    /*Abre la modal de editar usuario*/
    function openEdit (banco_id) {
      console.log("ver informacion ", banco_id);
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Bank.html', /*Llamo al template donde usare lamodal*/
        controller: 'BankEditController', /*nombre del controlador de la modal*/
        controllerAs: 'vm',
        resolve: { /*asi se pasa un parametro**/
          origin: function () {
            return {
              'origin':'bank',
              'banco_id':banco_id
            };
          }
        }
      });
    }

    $rootScope.$on('changeBank', function() {
      changePage(vm.pagination.current_page);
    });
  }


  function BankEditController ($uibModalInstance,$q,bank,toastr, $rootScope, origin, bankResource) {
    var vm = this;
    console.log("modal de edicion de banco",origin);
    vm.status="actualizar";
    cargar();

    function cargar () {
      bankResource.getFresh({'id':origin.banco_id},
          function success (data) {
            vm.bank = data;
            console.log(data);
          }, function error (err) {

          })
    }


    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }

    vm.save = function () {
      vm.isloading = true;
      bankResource.patch(vm.bank,
        function success (data) {
          toastr.success("Banco registrado exitosamente");
          if (origin.origin=="bank") {
            $rootScope.$broadcast('changeBank');
          }
          vm.isloading = false;
          $uibModalInstance.dismiss('cancel');
        }, function err (error) {
          if (error.status==409) {
            toastr.info("Ya existe un banco con este nombre", "Información");
          }
          vm.isloading = false;
        }
      )
      console.log("estoy actualizando ", vm.bank);
    }
  }

  function BankCreateController ($uibModalInstance,$q,bank,toastr, $rootScope, origin) {
    var vm = this;
    console.log(origin);
    vm.status="crear";
    vm.bank = {
      'nombre':"",
      'telefono':"",
      'descripcion': ""
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }

    vm.save = function () {
      vm.isloading = true;
      bank.save(vm.bank,
        function success(data) {
          toastr.success("Banco registrado exitosamente");
          if (origin.origin=="bank") {
            $rootScope.$broadcast('changeBank');
            console.log("el origien es el banco");
          }
          vm.isloading = false;
          $uibModalInstance.dismiss('cancel');
        }, function error (err) {
          if (err.status==422) {
            toastr.info("Ya existe un banco con este nombre", "Información");
          }
          vm.isloading = false;
        }
      )
    }
  }
