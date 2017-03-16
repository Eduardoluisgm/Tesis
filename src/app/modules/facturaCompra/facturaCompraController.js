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
      vm.fechas = {
        'inicio': new Date('2016-01-02'),
        'final': new Date()
      }
      vm.openInicio = false;
      vm.openFinal = false;
      vm.Buscar = {
        'busqueda':"",
        'actual':"",
        'buscando': false
      }
      search();

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
        if (vm.fechas.final<vm.fechas.inicio) {
          toastr.warning("La fecha final debe ser menor a la inicial", "Advertencia");
          return;
        }
        vm.fecha_inicio = moment(vm.fechas.inicio).format('YYYY-MM-DD HH:mm');
        vm.fecha_final = moment(vm.fechas.final).format('YYYY-MM-DD HH:mm');
        /*colocando la hora de inicio a las 0 horas*/
        vm.fecha_inicio = moment(vm.fecha_inicio).set('hour', 0);
        vm.fecha_inicio = moment(vm.fecha_inicio).set('minute', 0);
        vm.fecha_inicio = moment(vm.fecha_inicio).format('YYYY-MM-DD HH:mm');
        vm.fecha_final = moment(vm.fecha_final).set('hour', 23);
        vm.fecha_final = moment(vm.fecha_final).set('minute', 59);
        vm.fecha_final = moment(vm.fecha_final).format('YYYY-MM-DD HH:mm');
        console.log("fecha inicio: "+ vm.fecha_inicio);
        console.log("fecha final: "+ vm.fecha_final);
        if (vm.Buscar.actual) {
          vm.Buscar.busqueda = vm.Buscar.actual;
          vm.status = "Busqueda";
          changePage(1);
        } else {
          vm.status = "Normal";
          changePage(1);
        }
        console.log(vm.Buscar);
      }

      /*recarga todo al principio*/
      function reload () {
        vm.Buscar.busqueda = "";
        vm.status = "Normal";
        vm.fechas.inicio = new Date('2016-01-02');
        vm.fechas.final = new Date();
        changePage(1);
      }

      function changePage (number) {
        if (vm.status=="Normal") {
          var factura = factura_compra.getFresh({
            'page':number,
            'fecha_inicio': vm.fecha_inicio,
            'fecha_final': vm.fecha_final
          });
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
          var factura = factura_compra.getFresh({
            'page':number,
            'search': vm.Buscar.busqueda,
            'fecha_inicio': vm.fecha_inicio,
            'fecha_final': vm.fecha_final
          });
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

      vm.open_fecha_inicio = function() {
        vm.openInicio = !vm.openInicio;
      };
      /*abrir y cerrar el datepicker final*/
      vm.open_fecha_final = function() {
        vm.openFinal = !vm.openFinal;
      };
  };
