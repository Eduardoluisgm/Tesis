'use strict';

angular.module('frontEndApp')
  .controller('facturaCompraController', facturaCompraController);

  function facturaCompraController ($log, authUser,$rootScope, factura_compra, $q, $http, ApiUrl, factura_compraResource, toastr) {
      var vm = this;
      vm.listaFacturas = [];
      vm.pagination = [];
      vm.changePage = changePage;
      vm.Facturapdf = Facturapdf;
      vm.DeleteFactura = DeleteFactura;
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

    function DeleteFactura (factura_id) {
      console.log("factura que voy a eliminar "+ factura_id);
      factura_compraResource.delete({'id':factura_id},
        function success(data){
            toastr.success("Factura eliminada");
            changePage(vm.pagination.current_page);
        }, function err(err){
            toastr.error("Error de servidor");
        }
      )
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
