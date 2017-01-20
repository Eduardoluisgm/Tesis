'use strict';

angular.module('frontEndApp')
  .controller('proveedormasActivoController', proveedormasActivoController);

  function proveedormasActivoController ($log,profile, $q,$rootScope,toastr, ProveedormayoresCompras, ProveedorVolumenCompras) {
      var vm = this;
      console.log("proveedores mas activos");
      vm.listprovider = [];
      vm.search = search;
      vm.reload = reload;
      vm.providerMonto = {
        'nombres': [],
        'cantidades': []
      }
      vm.providerVolumen = {
        'nombres': [],
        'cantidades': []
      }
      vm.fechas = {
        'inicio': new Date(),
        'final': new Date()
      }
      vm.openInicio = false;
      vm.openFinal = false;

      cargar();

      function cargar () {
        var providermonto = ProveedormayoresCompras.queryFresh();
        var providervolumen = ProveedorVolumenCompras.queryFresh();
        $q.all([providermonto.$promise, providervolumen.$promise]).then(function (data){
          console.log(data);
          /*lleno el grafico del monto*/
          vm.listprovider = data[0];
          var count = 0;
          vm.listprovider.forEach(function(provider){
            vm.providerMonto.nombres[count]= provider.nombre;
            vm.providerMonto.cantidades[count]=parseFloat(provider.Monto);
            count = count +1;
          });

          /*Lleno el grafico de la cantidad*/
          vm.listprovider = data[1];
          count = 0;
          vm.listprovider.forEach(function(provider){
            vm.providerVolumen.nombres[count]= provider.nombre;
            vm.providerVolumen.cantidades[count]=parseInt(provider.Cantidad);
            count = count +1;
          });
        });
      }

      function reload() {
        console.log("estoy recargando ");
        vm.Buscar = false;
        cargar();
      }

      /*filtrar por fechas*/
      function search() {
        if (typeof(vm.fechas.final)=='undefined'|| typeof(vm.fechas.inicio)=='undefined') {
          toastr.warning("Rellene todos los campos", "Advertencia");
          return;
        }
        if (vm.fechas.final<vm.fechas.inicio) {
          toastr.warning("La fecha final debe ser menor a la inicial", "Advertencia");
          return;
        }

        var fecha_inicio = moment(vm.fechas.inicio).format('YYYY-MM-DD HH:mm');
        var fecha_final = moment(vm.fechas.final).format('YYYY-MM-DD HH:mm');
        /*colocando la hora de inicio a las 0 horas*/
        fecha_inicio = moment(fecha_inicio).set('hour', 0);
        fecha_inicio = moment(fecha_inicio).set('minute', 0);
        fecha_inicio = moment(fecha_inicio).format('YYYY-MM-DD HH:mm');
        fecha_final = moment(fecha_final).set('hour', 23);
        fecha_final = moment(fecha_final).set('minute', 59);
        fecha_final = moment(fecha_final).format('YYYY-MM-DD HH:mm');
        /*var products = ProductoComprado.queryFresh({
          'search': true,
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });*/
        var providermonto = ProveedormayoresCompras.queryFresh({
          'search': true,
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });
        var providervolumen = ProveedorVolumenCompras.queryFresh({
          'search': true,
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });
        $q.all([providermonto.$promise, providervolumen.$promise]).then(function (data){
          /*lleno el grafico del monto*/
          vm.listprovider = data[0];
          var count = 0;
          vm.providerMonto.nombres=[];
          vm.providerMonto.cantidades= [];
          vm.providerVolumen.nombres = [];
          vm.providerVolumen.cantidades=[];
          vm.Buscar = true;
          vm.listprovider.forEach(function(provider){
            vm.providerMonto.nombres[count]= provider.nombre;
            vm.providerMonto.cantidades[count]=parseFloat(provider.Monto);
            count = count +1;
          });

          /*Lleno el grafico de la cantidad*/
          vm.listprovider = data[1];
          count = 0;
          vm.listprovider.forEach(function(provider){
            vm.providerVolumen.nombres[count]= provider.nombre;
            vm.providerVolumen.cantidades[count]=parseInt(provider.Cantidad);
            count = count +1;
          });
        });
      }

      /*abrir y cerrar el datepicker inicio*/
      vm.open_fecha_inicio = function() {
        vm.openInicio = !vm.openInicio;
      };
      /*abrir y cerrar el datepicker final*/
      vm.open_fecha_final = function() {
        vm.openFinal = !vm.openFinal;
      };

      vm.series = ['Vendidos '];
      vm.options = {
        'scales': {
          'yAxes': [{
              'ticks': {
                  'beginAtZero':true
              }
          }]
        }
      };
  }
