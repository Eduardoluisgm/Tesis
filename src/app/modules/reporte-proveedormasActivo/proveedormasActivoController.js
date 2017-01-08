'use strict';

angular.module('frontEndApp')
  .controller('proveedormasActivoController', proveedormasActivoController);

  function proveedormasActivoController ($log,profile, $q,$rootScope,toastr, ProveedormayoresCompras, ProveedorVolumenCompras) {
      var vm = this;
      console.log("proveedores mas activos");
      vm.listprovider = [];
      vm.providerMonto = {
        'nombres': [],
        'cantidades': []
      }
      vm.providerVolumen = {
        'nombres': [],
        'cantidades': []
      }

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
