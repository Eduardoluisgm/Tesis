'use strict';

angular.module('frontEndApp')
  .controller('productomasVendidoController', productomasVendidoController);

  function productomasVendidoController ($log,profile, $q, authUser,$rootScope,toastr, userUpdate, ProductoVendido) {
      var vm = this;
      vm.listProduct = [];
      vm.product = {
        'nombres': [],
        'cantidades': []
      }
      vm.cantidades = [];
      cargar();

      function cargar() {
        var products = ProductoVendido.queryFresh();
        $q.all([products.$promise]).then(function (data){
          vm.listProduct = data[0];
          var count = 0;
          vm.listProduct.forEach(function(product){
            vm.product.nombres[count]= product.nombre;
            vm.product.cantidades[count]=parseInt(product.cantidad);
            count = count +1;
          });
          vm.cantidades[0]= vm.product.cantidades;
          console.log("cantidades ", vm.cantidades);
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
