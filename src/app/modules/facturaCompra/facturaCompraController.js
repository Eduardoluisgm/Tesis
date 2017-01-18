'use strict';

angular.module('frontEndApp')
  .controller('facturaCompraController', facturaCompraController);

  function facturaCompraController ($log, authUser,$rootScope, factura_compra, $q, $http, ApiUrl) {
      var vm = this;
      vm.listaFacturas = [];
      vm.pagination = [];
      vm.changePage = changePage;
      vm.status = "Normal";
      vm.reload = reload;
      vm.search = search;
      vm.Buscar = {
        'busqueda':"",
        'actual':"",
        'buscando': false
      }
      cargar();

      function cargar () {
        var factura = factura_compra.getFresh({'page':1});
        $q.all([factura.$promise]).then(function(data){
            console.log(data[0].data);
            vm.listaFacturas = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Normal";
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
          var factura = factura_compra.getFresh({'page':number});
          $q.all([factura.$promise]).then(function(data){
              vm.listaFacturas = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Normal";
              vm.Buscar.buscando=false;
          });
        }

        if (vm.status=="Busqueda") {
          var factura = factura_compra.getFresh({'page':number, 'search': vm.Buscar.busqueda});
          $q.all([factura.$promise]).then(function(data){
              vm.listaFacturas = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Busqueda";
              vm.Buscar.buscando=true;
          });
        }
      }
  };