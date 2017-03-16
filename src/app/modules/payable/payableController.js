'use strict';

angular.module('frontEndApp')
  .controller('payableController', payableController);

  function payableController (client,$q,$uibModal, $rootScope, toastr, cuenta_pagar, $http, ApiUrl, Total_pagar) {
    var vm = this;
    vm.pagination = [];
    vm.listaCuentas = [];
    vm.changePage = changePage;
    vm.openPagar = openPagar;
    vm.reload = reload;
    vm.search = search;
    vm.Facturapdf=Facturapdf;
    vm.status = "Normal";
    vm.total_pagar = 0;
    vm.Buscar = {
      'busqueda':"",
      'actual':"",
      'buscando': false
    }
    cargar();
    function cargar () {
      var cuenta = cuenta_pagar.getFresh({'page':1});
      var total = Total_pagar.getFresh();
      $q.all([cuenta.$promise, total.$promise]).then(function(data){
          console.log(data[0].data);
          vm.listaCuentas = data[0].data;
          vm.pagination.current_page = data[0].current_page;
          vm.pagination.per_page = data[0].per_page;
          vm.pagination.total = data[0].total;
          vm.pagination.last_page = data[0].last_page;
          vm.total_pagar = data[1].total;
      });
    }

    function Facturapdf(factura_id) {
      console.log("id de la factura "+ factura_id);
      $http({
        url: ApiUrl + '/factura_compra/'+factura_id+'/pdf',
        method: 'GET',
        responseType: 'arraybuffer'
      }).success(function(data) {
        var file = new Blob([data], {
          type: 'application/pdf'
        });
        var fileURL = URL.createObjectURL(file);
        /*window.open(fileURL,'download_window');*/
        var link = document.createElement('a');
        link.download = 'Factura compra '+factura_id;
        link.target = '_blank';
        link.href = fileURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        var total = Total_pagar.getFresh();
        $q.all([cuenta.$promise, total.$promise]).then(function(data){
            console.log(data[0].data);
            vm.listaCuentas = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Normal";
            vm.Buscar.buscando=false;
            vm.total_pagar = data[1].total;
        });
      }
      if (vm.status=="Busqueda") {
        var cuenta = cuenta_pagar.getFresh({'page':number, 'search': vm.Buscar.busqueda});
        var total = Total_pagar.getFresh();
        $q.all([cuenta.$promise, total.$promise]).then(function(data){
            vm.listaCuentas = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Busqueda";
            vm.Buscar.buscando=true;
            vm.total_pagar = data[1].total;
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
        size: 'lg',
        backdrop: false,
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
