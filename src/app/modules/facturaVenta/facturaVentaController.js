'use strict';

angular.module('frontEndApp')
  .controller('facturaVentaController', facturaVentaController);

  function facturaVentaController ($log, authUser,$rootScope, factura_venta, $q, $http, ApiUrl, factura_ventaResource, toastr) {
      var vm = this;
      vm.listaFacturas = [];
      vm.pagination = [];
      vm.changePage = changePage;
      vm.search = search;
      vm.Facturapdf =  Facturapdf;
      vm.DeleteFactura = DeleteFactura;
      vm.reload = reload;
      vm.status = "Normal";
      vm.Buscar = {
        'busqueda':"",
        'actual':"",
        'buscando': false
      }
      cargar();

      function cargar () {
        var factura = factura_venta.getFresh({'page':1});
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

      function DeleteFactura (factura_id) {
        console.log("factura que voy a eliminar "+ factura_id);
        factura_ventaResource.delete({'id':factura_id},
          function success(data){
              toastr.success("Factura eliminada");
              changePage(vm.pagination.current_page);
          }, function err(err){
              toastr.error("Error de servidor");
          }
        )
      }

      /*recarga todo al principio*/
      function reload () {
        vm.Buscar.busqueda = "";
        vm.status = "Normal";
        changePage(1);
      }

      function changePage (number) {
        if (vm.status=="Normal") {
          var factura = factura_venta.getFresh({'page':number});
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
          console.log("estoy buscando");
          var factura = factura_venta.getFresh({'page':number, 'search': vm.Buscar.busqueda});
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

      function Facturapdf(factura_id) {
        console.log("id de la factura "+ factura_id);
        $http({
          url: ApiUrl + '/factura_venta/'+factura_id+'/pdf',
          method: 'GET',
          responseType: 'arraybuffer'
        }).success(function(data) {
          var file = new Blob([data], {
            type: 'application/pdf'
          });
          var fileURL = URL.createObjectURL(file);
          /*window.open(fileURL,'download_window');*/
          var link = document.createElement('a');
          link.download = 'Factura venta '+factura_id;
          link.target = '_blank';
          link.href = fileURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      });
    }
  };
