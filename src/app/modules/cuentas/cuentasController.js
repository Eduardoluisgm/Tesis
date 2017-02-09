'use strict';

angular.module('frontEndApp')
  .controller('CuentaCreateController', CuentaCreateController)
  .controller('CuentaEditController', CuentaEditController)
  .controller('CuentasController', CuentasController);

  function CuentasController ($log,$rootScope, toastr, $uibModal, $q, cuentaBanco, cuentaResource) {
    var vm = this;
    vm.pagination = [];
    vm.listaCuentas = [];
    vm.openCreate = openCreate;
    vm.openEdit = openEdit;
    vm.changePage=changePage;
    vm.DeleteCuenta = DeleteCuenta;
    vm.reload = reload;
    vm.search = search;
    vm.status = "Normal";
    vm.Buscar = {
      'busqueda':"",
      'actual':"",
      'buscando': false
    }
    console.log("Cuentas de banco");

    cargar();

    function cargar () {
      var cuentas = cuentaBanco.getFresh({page:1});
      $q.all([cuentas.$promise]).then(function(data){
          vm.listaCuentas = data[0].data;
          vm.pagination.current_page = data[0].current_page;
          vm.pagination.per_page = data[0].per_page;
          vm.pagination.total = data[0].total;
          vm.pagination.last_page = data[0].last_page;
      });
    }


    function DeleteCuenta (cuenta_id) {
      console.log("cuenta a eliminar "+ cuenta_id);
      cuentaResource.delete({'id': cuenta_id},
        function success () {
          toastr.success("Cuenta eliminada con exito");
          changePage(vm.pagination.current_page);
        }, function error (err) {

        }
      )
    }

    function changePage (number) {
      if (vm.status=="Normal") {
        var cuentas = cuentaBanco.getFresh({page:number});
        $q.all([cuentas.$promise]).then(function(data){
            vm.listaCuentas = data[0].data;
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
        var cuentas = cuentaBanco.getFresh({page:number, 'search': vm.Buscar.busqueda});
        $q.all([cuentas.$promise]).then(function(data){
            vm.listaCuentas = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Busqueda";
            vm.Buscar.buscando=true;
        });
      }
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

    function openCreate () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Cuentas_Banco.html',
        controller: 'CuentaCreateController',
        controllerAs: 'vm',
        backdrop: false,
        resolve: {
          origin: function () {
            return {
              'origin':'cuenta_banco'
            };
          }
        }
      });
    }

    function openEdit (cuenta) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Cuentas_Banco.html',
        controller: 'CuentaEditController',
        controllerAs: 'vm',
        backdrop: false,
        resolve: {
          origin: function () {
            return {
              'origin':'cuenta_banco',
              'count_id': cuenta.id
            };
          }
        }
      });
    }

    $rootScope.$on('changeCount', function() {
      changePage(vm.pagination.current_page);
    });
  }

  function CuentaEditController ($uibModalInstance,$q,client,toastr, $rootScope, origin, bankActive, cuentaBanco, cuentaResource) {
    var vm = this;
    vm.status="actualizar";
    vm.isloading = false;
    vm.listaBancos = [];
    vm.cuenta = {
      'bank_id':'',
      'numero': '',
      'descripcion':''
    };
    cargar();

    function cargar () {
      var cuenta=cuentaResource.getFresh({'id':origin.count_id});
      var bancos= bankActive.queryFresh();
      $q.all([cuenta.$promise,bancos.$promise]).then(function(data){
          console.log(data);
          vm.cuenta = data[0];
          vm.listaBancos = data[1];
          var bandera = false;
          vm.listaBancos.forEach(function(banco){
            if (banco.id==vm.cuenta.bank_id) {
              bandera = true;
            }
          });
          if (!bandera) {
            vm.cuenta.bank_id = "";
          }
          console.log("Bandera "+ bandera+ " cuenta "+ vm.cuenta.bank_id);
      });
    }
    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    };

    vm.save= function () {
      if (!vm.cuenta.bank_id) {
        toastr.warning('Debe seleccionar un Banco');
        return;
      }
      vm.isloading = true;
      cuentaResource.patch(vm.cuenta,
        function success (data) {
          vm.isloading = false;
          toastr.success('Cuenta actualizada con exito');
          $rootScope.$broadcast('changeCount');
          $uibModalInstance.dismiss('cancel');
        },
        function error (err) {
          if (err.status==409) {
            toastr.error('Otra cuenta ya posee estos datos');
          }
          vm.isloading = false;
        }
      )
    }
  }


  function CuentaCreateController ($uibModalInstance,$q,client,toastr, $rootScope, origin, bankActive, cuentaBanco) {
    var vm = this;
    console.log(origin);
    vm.status="crear";
    vm.isloading = false;
    vm.listaBancos = [];
    vm.cuenta = {
      'bank_id':'',
      'numero': '',
      'descripcion':''
    };

    bankActive.queryFresh(
      function success (data) {
        vm.listaBancos = data;
        var bandera = false;
        vm.listaBancos.forEach(function (banco){
          if (!bandera) {
            vm.cuenta.bank_id = banco.id;
            bandera = true;
          }
        })
        console.log("Lista de Bancos ", vm.listaBancos);
      }, function error (err) {

      }
    );

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57) {} else {
        event.preventDefault();
      }
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    };

    vm.save = function() {
      if (!vm.cuenta.bank_id) {
        toastr.warning('Debe seleccionar un Banco');
        return;
      }
      vm.isloading = true;
      cuentaBanco.save(vm.cuenta,
        function success (data) {
          vm.isloading = false;
          toastr.success('Cuenta registrada con exito');
          $rootScope.$broadcast('changeCount');
          $uibModalInstance.dismiss('cancel');
        },
        function error (err) {
          console.log("error ", err);
          if (err.status==409) {
            toastr.error('La cuenta ya esta registrada para este banco');
          }
          vm.isloading = false;
        }
      )
    };

  }
