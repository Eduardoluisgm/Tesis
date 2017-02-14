'use strict';

angular.module('frontEndApp')
  .controller('productomasVendidoController', productomasVendidoController);

  function productomasVendidoController ($log,profile, $q, authUser,$rootScope,toastr, userUpdate, ProductoVendido) {
      var vm = this;
      vm.listProduct = [];
      vm.search = search;
      vm.reload = reload;
      vm.isLoading=false;
      vm.Buscar = false;
      vm.fechas = {
        'inicio': new Date(),
        'final': new Date()
      }
      vm.openInicio = false;
      vm.openFinal = false;
      vm.product = {
        'nombres': [],
        'cantidades': []
      }
      vm.cantidades = [];
      cargar();

      function cargar() {
        vm.isLoading=true;
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
          vm.isLoading = false;
        });
      }

      function reload() {
        console.log("estoy recargando ");
        vm.Buscar = false;
        cargar();
      }

      /*abrir y cerrar el datepicker inicio*/
      vm.open_fecha_inicio = function() {
        vm.openInicio = !vm.openInicio;
      };

      /*abrir y cerrar el datepicker final*/
      vm.open_fecha_final = function() {
        vm.openFinal = !vm.openFinal;
      };

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
        var products = ProductoVendido.queryFresh({
          'search': true,
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });
        $q.all([products.$promise]).then(function (data){
          vm.Buscar = true;
          vm.listProduct = data[0];
          vm.product.nombres= [];
          vm.product.cantidades = [];
          var count = 0;
          vm.listProduct.forEach(function(product){
            vm.product.nombres[count]= product.nombre;
            vm.product.cantidades[count]=parseInt(product.cantidad);
            count = count +1;
          });
          console.log("despues de busqueda ", vm.product.nombres);
          vm.cantidades[0]= vm.product.cantidades;
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
  }
