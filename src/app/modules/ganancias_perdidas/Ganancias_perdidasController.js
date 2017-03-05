'use strict';

angular.module('frontEndApp')
  .controller('ganancias_perdidasController', ganancias_perdidasController);

  function ganancias_perdidasController($log,profile, $q, authUser,$rootScope,toastr, userUpdate, ProductoVendido, Ganancias, Perdidas) {
      var vm = this;
      vm.listaGanancias = [];
      vm.listaPerdidas = [];
      vm.search = search;
      vm.showDate = '';
      vm.ganancia = {
        'monto_total': 0,
        'nombres': ['Cheque', 'Efectivo', 'Credito', 'Debito'],
        'montos': [],
        'cheque': 0,
        'efectivo': 0,
        'debito':0,
        'credito': 0
      };
      vm.perdida = {
        'monto_total': 0,
        'nombres': ['Cheque', 'Efectivo', 'Credito', 'Debito'],
        'montos': [],
        'cheque': 0,
        'efectivo': 0,
        'debito':0,
        'credito': 0
      };
      vm.isLoading = false;
      vm.fecha_final = new Date();
      vm.fecha_inicio = new Date();
      vm.open = false;
      vm.open2 = false;
      cargar();


      function cargar() {
        vm.isLoading = true;
        var fecha_inicio = moment(vm.fecha_inicio).format('YYYY-MM-DD HH:mm');
        var fecha_final = moment(vm.fecha_final).format('YYYY-MM-DD HH:mm');
        /*colocando la hora de inicio a las 0 horas*/
        fecha_inicio = moment(fecha_inicio).set('hour', 0);
        fecha_inicio = moment(fecha_inicio).set('minute', 0);
        fecha_inicio = moment(fecha_inicio).format('YYYY-MM-DD HH:mm');
        fecha_final = moment(fecha_final).set('hour', 23);
        fecha_final = moment(fecha_final).set('minute', 59);
        fecha_final = moment(fecha_final).format('YYYY-MM-DD HH:mm');
        var Gana = Ganancias.queryFresh({
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        });
        var perde = Perdidas.queryFresh({
          'fecha_inicio': fecha_inicio,
          'fecha_final': fecha_final
        })

        vm.showDate = moment(vm.fecha_inicio).format('YYYY-MM-DD') +" - "+ moment(vm.fecha_final).format('YYYY-MM-DD');

        $q.all([Gana.$promise, perde.$promise]).then(function (data){
          vm.isLoading = false;
          vm.listaGanancias = data[0];
          vm.listaPerdidas = data[1];
          vm.listaGanancias.forEach(function(pago){
            if (pago.tipo=='Efectivo') {
              vm.ganancia.efectivo =vm.ganancia.efectivo+parseFloat(pago.monto);
            }
            if (pago.tipo=='Debito') {
              vm.ganancia.debito =vm.ganancia.debito+parseFloat(pago.monto);
            }
            if (pago.tipo=='Credito') {
              vm.ganancia.credito =vm.ganancia.credito+parseFloat(pago.monto);
            }
            if (pago.tipo=="Cheque") {
              vm.ganancia.cheque =vm.ganancia.cheque+parseFloat(pago.monto);
            }
            vm.ganancia.monto_total = vm.ganancia.monto_total+parseFloat(pago.monto);
          });
          vm.ganancia.montos[0]= vm.ganancia.cheque;
          vm.ganancia.montos[1]= vm.ganancia.efectivo;
          vm.ganancia.montos[2]= vm.ganancia.credito;
          vm.ganancia.montos[3] =vm.ganancia.debito;

          /*Perdidas o egresos*/
          vm.listaPerdidas.forEach(function(pago){
            if (pago.tipo=='Efectivo') {
              vm.perdida.efectivo =vm.perdida.efectivo+parseFloat(pago.monto);
            }
            if (pago.tipo=='Debito') {
              vm.perdida.debito =vm.perdida.debito+parseFloat(pago.monto);
            }
            if (pago.tipo=='Credito') {
              vm.perdida.credito =vm.perdida.credito+parseFloat(pago.monto);
            }
            if (pago.tipo=="Cheque") {
              vm.perdida.cheque =vm.perdida.cheque+parseFloat(pago.monto);
            }
            vm.perdida.monto_total = vm.perdida.monto_total+parseFloat(pago.monto);
          });
          vm.perdida.montos[0]= vm.perdida.cheque;
          vm.perdida.montos[1]= vm.perdida.efectivo;
          vm.perdida.montos[2]= vm.perdida.credito;
          vm.perdida.montos[3] =vm.perdida.debito;


          console.log("Ganancia ", vm.ganancia);
        });
      }

      vm.options = {
        'scales': {
          'yAxes': [{
              'ticks': {
                  'beginAtZero':true
              }
          }]
        }
      };

      function search () {
        if (typeof(vm.fecha_inicio)!='undefined' && typeof(vm.fecha_final)!='undefined') {
          if (vm.fecha_inicio>vm.fecha_final) {
            toastr.warning("La fecha final debe ser mayor a la inicial");
            return;
          }
          vm.ganancia = {
            'monto_total': 0,
            'nombres': ['Cheque', 'Efectivo', 'Credito', 'Debito'],
            'montos': [],
            'cheque': 0,
            'efectivo': 0,
            'debito':0,
            'credito': 0
          };
          vm.perdida = {
            'monto_total': 0,
            'nombres': ['Cheque', 'Efectivo', 'Credito', 'Debito'],
            'montos': [],
            'cheque': 0,
            'efectivo': 0,
            'debito':0,
            'credito': 0
          };
          cargar();
        }
      }

      vm.openChange = function() {
        vm.open = !vm.open;
      };

      vm.openChange2 = function() {
        console.log(" a" + vm.open2);
        vm.open2 = !vm.open2;
      };
  }
