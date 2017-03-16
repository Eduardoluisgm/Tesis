'use strict';

angular.module('frontEndApp')
  .controller('receivableController', receivableController)
  .controller('receivablePayController', receivablePayController);

  function receivableController ($log, authUser,$rootScope, cuenta_cobrar, $q, $uibModal, ApiUrl, $http, Total_cobrar) {
    var vm = this;
    vm.pagination = [];
    vm.listaCuentas = [];
    vm.openCobrar = openCobrar;
    vm.Facturapdf =  Facturapdf;
    vm.changePage = changePage;
    vm.reload = reload;
    vm.search = search;
    vm.status = "Normal";
    vm.total_cobrar = 0;
    vm.Buscar = {
      'busqueda':"",
      'actual':"",
      'buscando': false
    }
    cargar();


    function cargar () {
      var cuenta = cuenta_cobrar.getFresh({'page':1});
      var total = Total_cobrar.getFresh();
      $q.all([cuenta.$promise, total.$promise]).then(function(data){
          vm.listaCuentas = data[0].data;
          vm.pagination.current_page = data[0].current_page;
          vm.pagination.per_page = data[0].per_page;
          vm.pagination.total = data[0].total;
          vm.pagination.last_page = data[0].last_page;
          vm.total_cobrar = data[1].total;
          vm.status = "Normal";
      });
    }

    /*funcion para buscar*/
    function search () {
      if (vm.Buscar.actual) {
        vm.Buscar.busqueda = vm.Buscar.actual;
        vm.status = "Busqueda";
        changePage(1);
      }
      console.log(vm.Buscar);
    }

    /*recarga todo al principio*/
    function reload () {
      vm.Buscar.busqueda = "";
      vm.status = "Normal";
      changePage(1);
    }

    function changePage (number) {
      if (vm.status=="Normal") {
        var cuenta = cuenta_cobrar.getFresh({'page':number});
        var total = Total_cobrar.getFresh();
        $q.all([cuenta.$promise, total.$promise]).then(function(data){
            console.log(data[1].data);
            vm.listaCuentas = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Normal";
            vm.Buscar.buscando=false;
            vm.total_cobrar = data[1].total;
        });
      }
      if (vm.status=="Busqueda") {
        var cuenta = cuenta_cobrar.getFresh({'page':number, 'search': vm.Buscar.busqueda});
        var total = Total_cobrar.getFresh();
        $q.all([cuenta.$promise, total.$promise]).then(function(data){
            vm.listaCuentas = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
            vm.status = "Busqueda";
            vm.Buscar.buscando=true;
            vm.total_cobrar = data[1].total;
        });
      }
     }

    /*Abre la modal para cobrar*/
    function openCobrar (Factura) {
      console.log("factura id : ", Factura);
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Cuentas_Pagar.html', /*Llamo al template donde usare lamodal*/
        controller: 'receivablePayController', /*nombre del controlador de la modal*/
        controllerAs: 'vm',
        size: 'lg',
        backdrop: false,
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

   function receivablePayController ($uibModalInstance,$q,bankActive,$rootScope, origin, toastr, factura_venta_pagos,cuentaBanco,factura_compra_pagos) {
     var vm = this;
     vm.isloading = false;
     vm.listaPagos = [];
     vm.bank = {
       'id':"",
       'list': []
     };
     /*lista de cuentas para cuando estamos comprando*/
     vm.cuenta = {
       'id':"",
       'list':[]
     };
     vm.origin = origin;
     vm.pago = 0;
     vm.total = 0;
     vm.cancelado = 0;

     function loadBanks() {
       bankActive.queryFresh(
         function success (data){
           vm.bank.list = data;
           console.log("lista de bancos ", vm.bank.list);
         }
       )
     }

     function loadCuentas() {
       cuentaBanco.queryFresh(
         function success (data) {
           vm.cuenta.list = data;
           console.log("Lista de cuentas ", vm.listaCuentas);
         }, function error (err) {

         }
       );
     }


     if (origin.origin=="cuentas_cobrar") {
       vm.total = parseFloat(origin.total);
       vm.cancelado = parseFloat(origin.cancelado);
       vm.diferencia = vm.total - vm.cancelado;
       vm.ListType = {
         'lista': [{'id':"Efectivo", 'name' : 'Efectivo'},{'id':"Debito", 'name' : 'Debito'},{'id':"Credito", 'name' : 'Credito'}],
         'tipo': "Efectivo"
       };
       loadBanks();
     }
     if (origin.origin=="cuentas_pagar") {
       vm.total = parseFloat(origin.total);
       vm.cancelado = parseFloat(origin.cancelado);
       vm.diferencia = vm.total - vm.cancelado;
       vm.ListType = {
         'lista': [{'id':"Efectivo", 'name' : 'Efectivo'},{'id':"Debito", 'name' : 'Debito'},{'id':"Credito", 'name' : 'Credito'},{'id':"Cheque", 'name' : 'Cheque'}],
         'tipo': "Efectivo"
       };
       loadCuentas();
     }

     vm.deletePago = function (pago) {
       console.log("eliminando pago");
     }

     vm.changePrecio = function () {
       if (vm.pago>100000000000) {
         vm.pago = 100000000000;
       }
     }

     vm.add_pago = function() {
       if (vm.pago>0) {
         if (vm.pago+vm.cancelado>vm.total) {
           toastr.info ('El monto cancelado no debe exceder el monto total');
           return;
         }
         if (vm.ListType.tipo=="Efectivo") {
           vm.listaPagos.push({
             'tipo': vm.ListType.tipo,
             'monto': vm.pago
           })
         } else {
           if (vm.origin.origin=="cuentas_cobrar") {
             if (!vm.bank.id) {
               toastr.info ('Seleccione un banco');
               return;
             }
             var banco_name = "";
             vm.bank.list.forEach(function(banco){
               console.log(banco);
               if (banco.id==vm.bank.id) {
                 banco_name = banco.nombre;
               }
             });
             vm.listaPagos.push({
               'tipo': vm.ListType.tipo,
               'monto': vm.pago,
               'banco_id': vm.bank.id,
               'banco_name': banco_name
             });
           }
           if (vm.origin.origin=="cuentas_pagar") {
             if (!vm.cuenta.id) {
               toastr.info ('Seleccione una cuenta');
               return;
             }
             vm.listaPagos.push({
               'tipo': vm.ListType.tipo,
               'monto': vm.pago,
               'cuenta_id': vm.cuenta.id
             });
           }

         }
         console.log("lista de pagos ", vm.listaPagos);
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
       vm.diferencia = vm.total - vm.cancelado;
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
