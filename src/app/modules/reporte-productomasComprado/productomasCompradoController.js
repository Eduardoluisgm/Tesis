'use strict';

angular.module('frontEndApp')
  .controller('productomasCompradoController', productomasCompradoController);

  function productomasCompradoController ($log,profile, $q,$rootScope,toastr, ProductoComprado) {
      var vm = this;
      vm.listProduct = [];
      vm.product = {
        'nombres': [],
        'cantidades': []
      }

      cargar();

      function cargar() {
        var products = ProductoComprado.queryFresh();
        $q.all([products.$promise]).then(function (data){
          vm.listProduct = data[0];
          var count = 0;
          vm.listProduct.forEach(function(product){
            vm.product.nombres[count]= product.nombre;
            vm.product.cantidades[count]=parseInt(product.cantidad);
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
