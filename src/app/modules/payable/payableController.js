'use strict';

angular.module('frontEndApp')
  .controller('payableController', payableController);

  function payableController (client,$q,$uibModal, $rootScope, toastr, cuenta_pagar) {
    var vm = this;
    vm.pagination = [];
    vm.listaCuentas = [];
    vm.changePage = changePage;
    vm.openPagar = openPagar;
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
      var cuenta = cuenta_pagar.getFresh({'page':1});
      $q.all([cuenta.$promise]).then(function(data){
          console.log(data[0].data);
          vm.listaCuentas = data[0].data;
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

    function changePage (number) {
      if (vm.status=="Normal") {
        var cuenta = cuenta_pagar.getFresh({'page':number});
        $q.all([cuenta.$promise]).then(function(data){
            console.log(data[0].data);
            vm.listaCuentas = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Normal";
            vm.Buscar.buscando=false;
        });
      }
      if (vm.status=="Busqueda") {
        var cuenta = cuenta_pagar.getFresh({'page':number, 'search': vm.Buscar.busqueda});
        $q.all([cuenta.$promise]).then(function(data){
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

    /*Abre la modal para cobrar*/
    function openPagar (Factura) {
      console.log("factura id : ", Factura);
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Cuentas_Pagar.html', /*Llamo al template donde usare lamodal*/
        controller: 'receivablePayController', /*nombre del controlador de la modal*/
        controllerAs: 'vm',
        resolve: {
          origin: function () {
            return {
              'origin': "cuentas_pagar",
              'factura_id': Factura.id,
              'total':Factura.monto_total,
              'cancelado':Factura.monto_cancelado
            };
          }
        }
      });
    }

    $rootScope.$on('payableReload', function() {
      changePage(vm.pagination.current_page);
    });
  }
