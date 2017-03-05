'use strict';

angular.module('frontEndApp')
  .controller('impuestoRentaController', impuestoRentaController);

  function impuestoRentaController ($q,$rootScope,toastr, Ganancias, Perdidas, inventarioYear) {
      var vm = this;
      vm.calcularImpuesto = calcularImpuesto;
      vm.impuesto = {
        'year': '',
        'Gastos_operativos': 0,
        'unidad_tributaria':0,
        'fecha_actual': moment().year(),
        'fecha_minima': 2016,
        'listYear': []
      };
      vm.listaGanancias = []; /*Lista de todas las ventas realizadas en un a'o*/
      vm.listaPerdidas = []; /*Lista de todas las compras realizadas en un a;o*/
      vm.inventario_inicial = {};
      vm.inventario_final = {};
      vm.costo_venta = 0; /*inventario inicial + compras - inventario final*/
      vm.utilidad_bruta = 0; /*ventas - costo_venta*/
      vm.utilidad_neta = 0; /*utilidad bruta - gastos operativos*/
      vm.renta_gravable = 0; /*utilidad neta - 774*unidad tributaria*/ /*degravamen unico por miscelaneos si da chance*/
      vm.unidades_tributarias = 0; /*renta gravable/ precio de unidad tributaria*/
      vm.impuesto_renta = 0;
      vm.Ganancia = 0;
      vm.Perdida = 0;
      vm.isLoading = false;
      vm.isLoaded = false;

      vm.listaImpuestos = [
        {'texto': 'Por la fracción comprendida hasta 1000UT', 'porcentaje': 6, 'sustraendo': 0, 'min':0, 'max':1000},
        {'texto': 'Por la fracción que exceda de 1000UT hasta 1500UT', 'porcentaje': 9, 'sustraendo': 30 , 'min':1001, 'max':1500},
        {'texto': 'Por la fracción que exceda de 1501UT hasta 2000UT', 'porcentaje': 12, 'sustraendo': 75 , 'min':1501, 'max':2000},
        {'texto': 'Por la fracción que exceda de 2001UT hasta 2500UT', 'porcentaje': 16, 'sustraendo': 155 , 'min':2001, 'max':2500},
        {'texto': 'Por la fracción que exceda de 2501UT hasta 3000UT', 'porcentaje': 20, 'sustraendo': 255 , 'min':2501, 'max':3000},
        {'texto': 'Por la fracción que exceda de 3001UT hasta 4000UT', 'porcentaje': 24, 'sustraendo': 375 , 'min':3001, 'max':4000},
        {'texto': 'Por la fracción que exceda de 4001UT hasta 6000UT', 'porcentaje': 29, 'sustraendo': 575 , 'min':4001, 'max':6000},
        {'texto': 'Por la fracción que exceda de 6001UT', 'porcentaje': 34, 'sustraendo': 875, 'min':6001, 'max':990000000000000}
      ]

      restarFechas();


      function calcularImpuesto () {
        /*Seteando las fechas como las quiero*/
        var fecha_inicio = moment(vm.impuesto.year+'-01-01 00:00').format('YYYY-MM-DD HH:mm');
        var fecha_final = moment(vm.impuesto.year+'-12-31 23:59').format('YYYY-MM-DD HH:mm');

        /*ganancias*/
        var Gana = Ganancias.queryFresh({
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });

        /*perdidas*/
        var perde = Perdidas.queryFresh({
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });

        /*A;o qu estoy seleccionando*/
        var Year_inicio = inventarioYear.getFresh({
          'year':vm.impuesto.year
        });

        /**/
        var Year_final = inventarioYear.getFresh({
          'year':vm.impuesto.year+1
        })

        vm.isLoading = true;


        $q.all([Gana.$promise, perde.$promise, Year_inicio.$promise, Year_final.$promise]).then(function (data){
          vm.listaGanancias = data[0];
          vm.listaPerdidas = data [1];
          vm.inventario_inicial = data[2];
          vm.inventario_final = data[3];
          vm.Ganancia = 0;
          vm.Perdida = 0;
          vm.costo_venta = 0;
          if (typeof(vm.inventario_final.monto)=='undefined') {
            toastr.warning("El inventario del año: " +(vm.impuesto.year+1)+" no se encuentra registrado");
            vm.isLoading = false;
            return;
          }

          if (typeof(vm.inventario_inicial.monto)=='undefined') {
            toastr.warning("El inventario del año: " +vm.impuesto.year+" no se encuentra registrado");
            return;
          }

          vm.listaGanancias.forEach(function(pago){
            vm.Ganancia= vm.Ganancia+parseFloat(pago.monto);
          });

          vm.listaPerdidas.forEach(function(pago){
            vm.Perdida = vm.Perdida+parseFloat(pago.monto); /*estos son las compras*/
          });
          /**/
          /*vm.Ganancia = 2644410;
          vm.Perdida = 2900804.94;
          vm.inventario_inicial.monto = 145630;
          vm.inventario_final.monto = 972250.96;*/
          console.log("inventario inicial "+   vm.inventario_inicial);
          console.log("inventario final"+   vm.inventario_final);

          vm.costo_venta = parseFloat(vm.inventario_inicial.monto)+parseFloat(vm.Perdida) -parseFloat(vm.inventario_final.monto);
          vm.utilidad_bruta = parseFloat(vm.Ganancia)-vm.costo_venta;
          vm.utilidad_neta = vm.utilidad_bruta-parseFloat(vm.impuesto.Gastos_operativos);
          vm.renta_gravable = vm.utilidad_neta - (774 * vm.impuesto.unidad_tributaria);
          vm.unidades_tributarias = vm.renta_gravable / vm.impuesto.unidad_tributaria;

          /*parta del impuesto sobre la renta*/
          if (vm.unidades_tributarias<=1000) {
            vm.impuesto_renta = vm.renta_gravable*0.06-(10*vm.impuesto.unidad_tributaria); /*el diez es de las cargas familiares*/
          } else if (vm.unidades_tributarias>1000 && vm.unidades_tributarias<=1500) {
            vm.impuesto_renta = vm.renta_gravable*0.09-((30+10)*vm.impuesto.unidad_tributaria);
          } else if (vm.unidades_tributarias>1500 && vm.unidades_tributarias<=2000) {
            vm.impuesto_renta = vm.renta_gravable*0.12-((75+10)*vm.impuesto.unidad_tributaria);
          } else if (vm.unidades_tributarias>2000 && vm.unidades_tributarias<=2500) {
            vm.impuesto_renta = vm.renta_gravable*0.16-((155+10)*vm.impuesto.unidad_tributaria);
          }  else if (vm.unidades_tributarias>2500 && vm.unidades_tributarias<=3000) {
            vm.impuesto_renta = vm.renta_gravable*0.2-((255+10)*vm.impuesto.unidad_tributaria);
          } else if (vm.unidades_tributarias>3000 && vm.unidades_tributarias<=4000) {
            vm.impuesto_renta = vm.renta_gravable*0.24-((375+10)*vm.impuesto.unidad_tributaria);
          } else if (vm.unidades_tributarias>4000 && vm.unidades_tributarias<=6000) {
            vm.impuesto_renta = vm.renta_gravable*0.29-((575+10)*vm.impuesto.unidad_tributaria);
          } else if (vm.unidades_tributarias>6000) {
            vm.impuesto_renta = vm.renta_gravable*0.34-((875+10)*vm.impuesto.unidad_tributaria);
          }

          vm.isLoading = false;
          vm.isLoaded = true;
          console.log("Utilidad Bruta "+ vm.utilidad_bruta);
        });
        console.log(fecha_inicio + " fecha final "+ fecha_final);
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



      vm.changePrecio = function () {
        if (vm.impuesto.Gastos_operativos>100000000000) {
          vm.impuesto.Gastos_operativos = 100000000000;
        }
      }

      vm.solonumeros = function(event) {
        if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
          event.preventDefault();
        }
      }
  }
