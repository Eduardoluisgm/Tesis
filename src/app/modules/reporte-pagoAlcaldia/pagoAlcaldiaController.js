'use strict';

angular.module('frontEndApp')
  .controller('pagoAlcaldiaController', pagoAlcaldiaController);

  function pagoAlcaldiaController ($q,$rootScope,toastr, Ganancias) {
      var vm = this;
      vm.calcularImpuesto = calcularImpuesto;
      vm.isLoading = false;
      vm.isLoaded = false;
      vm.impuesto = {
        'year': '',
        'porcentaje': 0,
        'fecha_actual': moment().year(),
        'fecha_minima': 2016,
        'listYear': [],
        'trimestre1':0,
        'trimestre2':0,
        'trimestre3':0,
        'trimestre4':0,
        'impuesto1':0,
        'impuesto2':0,
        'impuesto3':0,
        'impuesto4':0
      };
      vm.labels = {
        'porcentaje': '',
        'year':''
      }
      vm.nombres = ['Ventas', 'Impuestos'];
      vm.trimestre1 = [];
      vm.trimestre2 = [];
      vm.trimestre3 = [];
      vm.trimestre4 = [];
      restarFechas();


      function calcularImpuesto () {
        if (vm.impuesto.porcentaje==0) {
          toastr.warning("El porcentaje debe ser mayor a cero");
          return;
        }
        vm.isLoading = true;
        var fecha_inicio_1 = moment(vm.impuesto.year+'-01-01 00:00').format('YYYY-MM-DD HH:mm');
        var fecha_final_1 = moment(vm.impuesto.year+'-03-31 23:59').format('YYYY-MM-DD HH:mm');

        var fecha_inicio_2 = moment(vm.impuesto.year+'-04-01 00:00').format('YYYY-MM-DD HH:mm');
        var fecha_final_2 = moment(vm.impuesto.year+'-06-30 23:59').format('YYYY-MM-DD HH:mm');

        var fecha_inicio_3 = moment(vm.impuesto.year+'-07-01 00:00').format('YYYY-MM-DD HH:mm');
        var fecha_final_3 = moment(vm.impuesto.year+'-09-30 23:59').format('YYYY-MM-DD HH:mm');

        var fecha_inicio_4 = moment(vm.impuesto.year+'-10-01 00:00').format('YYYY-MM-DD HH:mm');
        var fecha_final_4 = moment(vm.impuesto.year+'-12-31 23:59').format('YYYY-MM-DD HH:mm');

      /*  console.log("trimestre 1: "+ fecha_inicio_1 +" "+ fecha_final_1);
        console.log("trimestre 2: "+ fecha_inicio_2 +" "+ fecha_final_2);
        console.log("trimestre 3: "+ fecha_inicio_3 +" "+ fecha_final_3);
        console.log("trimestre 4: "+ fecha_inicio_4 +" "+ fecha_final_4); */
        var trimestre1 = Ganancias.queryFresh({
          'fecha_inicio': fecha_inicio_1,
          'fecha_final': fecha_final_1
        });
        var trimestre2 = Ganancias.queryFresh({
          'fecha_inicio': fecha_inicio_2,
          'fecha_final': fecha_final_2
        });
        var trimestre3 = Ganancias.queryFresh({
          'fecha_inicio': fecha_inicio_3,
          'fecha_final': fecha_final_3
        });
        var trimestre4 = Ganancias.queryFresh({
          'fecha_inicio': fecha_inicio_4,
          'fecha_final': fecha_final_4
        });

        vm.labels.porcentaje = vm.impuesto.porcentaje;
        vm.labels.year = vm.impuesto.year;

        $q.all([trimestre1.$promise, trimestre2.$promise, trimestre3.$promise, trimestre4.$promise]).then(function(data){
          vm.impuesto.trimestre1 = 0;
          vm.impuesto.trimestre2 = 0;
          vm.impuesto.trimestre3 = 0;
          vm.impuesto.trimestre4 = 0;
          vm.impuesto.impuesto1 = 0;
          vm.impuesto.impuesto2 = 0;
          vm.impuesto.impuesto3 = 0;
          vm.impuesto.impuesto4 = 0;
          vm.trimestre1 = [];
          vm.trimestre2 = [];
          vm.trimestre3 = [];
          vm.trimestre4 = [];
          var lista = [];
          /*Primer Trimestre*/
          lista = data[0];
          lista.forEach(function(pago){
            vm.impuesto.trimestre1=vm.impuesto.trimestre1+parseFloat(pago.monto);
          });
          /*Segundo Trimestre*/
          lista = data[1];
          lista.forEach(function(pago){
            vm.impuesto.trimestre2=vm.impuesto.trimestre2+parseFloat(pago.monto);
          });
          /*3er trimestre*/
          lista = data[2];
          lista.forEach(function(pago){
            vm.impuesto.trimestre3=vm.impuesto.trimestre3+parseFloat(pago.monto);
          });
          /*4to trimestre*/
          lista = data[3];
          lista.forEach(function(pago){
            vm.impuesto.trimestre4=vm.impuesto.trimestre4+parseFloat(pago.monto);
          });
          vm.impuesto.impuesto1 = (vm.impuesto.trimestre1*vm.impuesto.porcentaje)/100;
          vm.impuesto.impuesto2 = (vm.impuesto.trimestre2*vm.impuesto.porcentaje)/100;
          vm.impuesto.impuesto3 = (vm.impuesto.trimestre3*vm.impuesto.porcentaje)/100;
          vm.impuesto.impuesto4 = (vm.impuesto.trimestre4*vm.impuesto.porcentaje)/100;

          /*llenar graficos*/
          vm.trimestre1[0]= vm.impuesto.trimestre1;
          vm.trimestre1[1]= vm.impuesto.impuesto1;
          vm.trimestre2[0]= vm.impuesto.trimestre2;
          vm.trimestre2[1]= vm.impuesto.impuesto2;
          vm.trimestre3[0]= vm.impuesto.trimestre3;
          vm.trimestre3[1]= vm.impuesto.impuesto3;
          vm.trimestre4[0]= vm.impuesto.trimestre4;
          vm.trimestre4[1]= vm.impuesto.impuesto4;

          console.log(vm.trimestre1);
          console.log(vm.nombres);

          vm.isLoading = false;
          vm.isLoaded = true;
        });

      }



      /*Funcion qu restara las fechas dependiendo de la fecha actual*/
      function restarFechas ()  {
        var aux = vm.impuesto.fecha_actual;
        var count = 1;
        while (aux>=vm.impuesto.fecha_minima && count<100) {
          console.log("Aux "+ aux);
          vm.impuesto.listYear.push({
            'year': aux,
            'id':aux
          });
          aux = aux-1;
          count++;
        }
      }


      vm.solonumeros = function(event) {
        if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
          event.preventDefault();
        }
      }

      vm.changePorcentaje = function () {
        if (vm.impuesto.porcentaje>100) {
          vm.impuesto.porcentaje=100;
        }
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
