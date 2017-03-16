'use strict';

angular.module('frontEndApp')
  .controller('clientemasActivoController', clientemasActivoController);

  function clientemasActivoController ($log,profile, $q, authUser,$rootScope,toastr, ClientemayoresCompras, ClienteVolumenCompras) {
      var vm = this;
      vm.listClient = [];
      vm.search = search;
      vm.reload = reload;
      vm.isLoading=false;
      vm.clientMonto = {
        'nombres': [],
        'cantidades': []
      }
      vm.clientVolumen = {
        'nombres': [],
        'cantidades': []
      }
      vm.fechas = {
        'inicio': new Date(),
        'final': new Date()
      }
      vm.openInicio = false;
      vm.openFinal = false;

      vm.cantidades = [];
      cargar();

      function cargar() {
        vm.isLoading=true;
        var clientmonto = ClientemayoresCompras.queryFresh();
        var clientvolumen = ClienteVolumenCompras.queryFresh();
        $q.all([clientmonto.$promise, clientvolumen.$promise]).then(function (data){
          /*lleno el grafico del monto*/
          vm.listClient = data[0];
          var count = 0;
          vm.listClient.forEach(function(client){
            vm.clientMonto.nombres[count]= client.name;
            vm.clientMonto.cantidades[count]=parseFloat(client.Monto);
            count = count +1;
          });
          /*Lleno el grafico de la cantidad*/
          vm.listClient = data[1];
          count = 0;
          vm.listClient.forEach(function(client){
            vm.clientVolumen.nombres[count]= client.name;
            vm.clientVolumen.cantidades[count]=parseInt(client.Cantidad);
            count = count +1;
          });
          vm.isLoading=false;
        });
      }

      function reload() {
        console.log("estoy recargando ");
        vm.Buscar = false;
        cargar();
      }

      function search() {
        if (typeof(vm.fechas.final)=='undefined'|| typeof(vm.fechas.inicio)=='undefined') {
          toastr.warning("Rellene todos los campos", "Advertencia");
          return;
        }
        if (vm.fechas.final<vm.fechas.inicio) {
          toastr.warning("La fecha final debe ser menor a la inicial", "Advertencia");
          return;
        }

        vm.isLoading=true;

        var fecha_inicio = moment(vm.fechas.inicio).format('YYYY-MM-DD HH:mm');
        var fecha_final = moment(vm.fechas.final).format('YYYY-MM-DD HH:mm');
        /*colocando la hora de inicio a las 0 horas*/
        fecha_inicio = moment(fecha_inicio).set('hour', 0);
        fecha_inicio = moment(fecha_inicio).set('minute', 0);
        fecha_inicio = moment(fecha_inicio).format('YYYY-MM-DD HH:mm');
        fecha_final = moment(fecha_final).set('hour', 23);
        fecha_final = moment(fecha_final).set('minute', 59);
        fecha_final = moment(fecha_final).format('YYYY-MM-DD HH:mm');

        var clientmonto = ClientemayoresCompras.queryFresh({
          'search': true,
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });
        var clientvolumen = ClienteVolumenCompras.queryFresh({
          'search': true,
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });
        $q.all([clientmonto.$promise, clientvolumen.$promise]).then(function (data){
          /*lleno el grafico del monto*/
          vm.Buscar = true;
          vm.listClient = data[0];
          vm.clientMonto.nombres=[];
          vm.clientMonto.cantidades=[];
          vm.clientVolumen.nombres=[];
          vm.clientVolumen.cantidades=[];
          var count = 0;
          vm.listClient.forEach(function(client){
            vm.clientMonto.nombres[count]= client.name;
            vm.clientMonto.cantidades[count]=parseFloat(client.Monto);
            count = count +1;
          });
          /*Lleno el grafico de la cantidad*/
          vm.listClient = data[1];
          count = 0;
          vm.listClient.forEach(function(client){
            vm.clientVolumen.nombres[count]= client.name;
            vm.clientVolumen.cantidades[count]=parseInt(client.Cantidad);
            count = count +1;
          });

          vm.isLoading=false;
        });
      }
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

      /*abrir y cerrar el datepicker inicio*/
      vm.open_fecha_inicio = function() {
        vm.openInicio = !vm.openInicio;
      };
      /*abrir y cerrar el datepicker final*/
      vm.open_fecha_final = function() {
        vm.openFinal = !vm.openFinal;
      };
  }
