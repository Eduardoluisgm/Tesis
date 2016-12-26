'use strict';

angular.module('frontEndApp')
  .controller('receivableController', receivableController)
  .controller('receivablePayController', receivablePayController);

  function receivableController ($log, authUser,$rootScope, cuenta_cobrar, $q, $uibModal, ApiUrl, $http) {
    var vm = this;
    vm.pagination = [];
    vm.listaCuentas = [];
    vm.openCobrar = openCobrar;
    vm.Facturapdf =  Facturapdf;
    vm.changePage = changePage;
    cargar();


    function cargar () {
      var cuenta = cuenta_cobrar.getFresh({'page':1});
      $q.all([cuenta.$promise]).then(function(data){
          console.log(data[0].data);
          vm.listaCuentas = data[0].data;
          vm.pagination.current_page = data[0].current_page;
          vm.pagination.per_page = data[0].per_page;
          vm.pagination.total = data[0].total;
          vm.pagination.last_page = data[0].last_page;
      });
    }

    function changePage (number) {
      console.log("cambiando pagina: " + number);
      var cuenta = cuenta_cobrar.getFresh({'page':number});
      $q.all([cuenta.$promise]).then(function(data){
          console.log(data[0].data);
          vm.listaCuentas = data[0].data;
          vm.pagination.current_page = data[0].current_page;
          vm.pagination.per_page = data[0].per_page;
          vm.pagination.total = data[0].total;
          vm.pagination.last_page = data[0].last_page;
      });
    }

    /*Abre la modal para cobrar*/
    function openCobrar (Factura) {
      console.log("factura id : ", Factura);
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Cuentas_Pagar.html', /*Llamo al template donde usare lamodal*/
        controller: 'receivablePayController', /*nombre del controlador de la modal*/
        controllerAs: 'vm',
        resolve: {
          origin: function () {
            return {
              'origin': "cuentas_cobrar",
              'factura_id': Factura.id,
              'total':Factura.monto_total,
              'cancelado':Factura.monto_cancelado
            };
          }
        }
      });
    }

    function Facturapdf(factura_id) {
      console.log("id de la factura "+ factura_id);
      $http({
        url: ApiUrl + '/factura_venta/'+factura_id+'/pdf',
        method: 'GET',
        responseType: 'arraybuffer'
      }).success(function(data) {
        var file = new Blob([data], {
          type: 'application/pdf'
        });
        var fileURL = URL.createObjectURL(file);
        /*window.open(fileURL,'download_window');*/
        var link = document.createElement('a');
        link.download = 'Factura '+factura_id;
        link.target = '_blank';
        link.href = fileURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  }

    $rootScope.$on('receivableReload', function() {
      changePage(vm.pagination.current_page);
    });
   }

   function receivablePayController ($uibModalInstance,$q, $rootScope, origin, toastr, factura_venta_pagos, factura_compra_pagos) {
     var vm = this;
     vm.isloading = false;
     vm.listaPagos = [];
     vm.ListType = {
       'lista': [{'id':"Efectivo", 'name' : 'Efectivo'},{'id':"Debito", 'name' : 'Debito'},{'id':"Credito", 'name' : 'Credito'}],
       'tipo': "Efectivo"
     };
     vm.pago = 0;
     vm.total = 0;
     vm.cancelado = 0;

     if (origin.origin=="cuentas_cobrar") {
       vm.total = parseFloat(origin.total);
       vm.cancelado = parseFloat(origin.cancelado);
     }
     if (origin.origin=="cuentas_pagar") {
       vm.total = parseFloat(origin.total);
       vm.cancelado = parseFloat(origin.cancelado);
     }
     console.log(origin);

     vm.add_pago = function () {
       console.log("agregando pago");
     }

     vm.deletePago = function (pago) {
       console.log("eliminando pago");
     }

     vm.add_pago = function() {
       if (vm.pago>0) {
         vm.listaPagos.push({
           'tipo': vm.ListType.tipo,
           'monto': vm.pago
         })
         vm.calcular();
       }
     }

     vm.deletePago = function (pago) {
       var count = 0;
       pago.tipo = "";
       pago.monto ="";
       vm.listaPagos.forEach(function (detalle){
         if (detalle.tipo=="") {
           vm.listaPagos.splice(count,1);
         }
         count++;
       });
       vm.calcular();
     }

     vm.solonumeros = function(event) {
       if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
         event.preventDefault();
       }
     }

     vm.calcular = function(){
       vm.cancelado = 0;
       vm.listaPagos.forEach(function (pago){
         vm.cancelado = vm.cancelado + pago.monto;
       });
       vm.cancelado = vm.cancelado + parseFloat(origin.cancelado);
     }

     vm.save = function (){
       vm.isloading = true;
       if (vm.cancelado>vm.total) {
         toastr.info('El monto cancelado no debe exceder el monto total');
         vm.isloading = false;
         return;
       }

       if (Object.keys(vm.listaPagos).length<1) {
         toastr.info ('Debe agregar al menos un pago');
         vm.isloading = false;
         return;
       }

       var pagos = JSON.stringify(vm.listaPagos);

       if (origin.origin=="cuentas_cobrar") {
         factura_venta_pagos.save({'id': origin.factura_id, 'pagos':pagos},
          function success (data) {
            toastr.success('Pago Registrado con Exito');
            vm.isloading = false;
            $uibModalInstance.dismiss('cancel');
            $rootScope.$broadcast('receivableReload');

          }, function error (err) {
            toastr.error('Error del servidor');
            vm.isloading = false;
          });
       }

       if (origin.origin=="cuentas_pagar") {
         factura_compra_pagos.save({'id': origin.factura_id, 'pagos':pagos},
          function success (data) {
            toastr.success('Pago Registrado con Exito');
            vm.isloading = false;
            $uibModalInstance.dismiss('cancel');
            $rootScope.$broadcast('payableReload');

          }, function error (err) {
            toastr.error('Error del servidor');
            vm.isloading = false;
          });
       }
     }

     vm.cancel= function() {
       $uibModalInstance.dismiss('cancel');
     }
   }
