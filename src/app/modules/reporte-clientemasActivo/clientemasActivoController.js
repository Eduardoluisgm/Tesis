'use strict';

angular.module('frontEndApp')
  .controller('clientemasActivoController', clientemasActivoController);

  function clientemasActivoController ($log,profile, $q, authUser,$rootScope,toastr, ClientemayoresCompras, ClienteVolumenCompras) {
      var vm = this;
      vm.listClient = [];
      vm.clientMonto = {
        'nombres': [],
        'cantidades': []
      }
      vm.clientVolumen = {
        'nombres': [],
        'cantidades': []
      }

      vm.cantidades = [];
      cargar();

      function cargar() {
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
          console.log("volumen ", vm.clientVolumen);
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
  }
