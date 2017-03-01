'use strict';

angular.module('frontEndApp')
  .controller('NotificationController', NotificationController)
  .controller('mainController', mainController);

  function mainController ($log,$uibModal, authUser,$rootScope,messageActive,notification_min_stock, notification_max_stock ,$q, notification_factura_venta_deuda, notification_factura_compra_deuda, inventario) {
      var vm = this;
      vm.openNotification = openNotification;
      vm.listMin_stock = []; /*Lista de productos con stock minimo*/
      vm.listMax_stock = [];
      vm.listFacturaVenta = []; /*Lista de facturas de venta con mas de 7 dias sin pagar*/
      vm.listaFacturaCompra = []; /*Lista de facturas de compra con mas de 7 dias sin pagar*/
      vm.listaMensajes = [];
      vm.fecha = moment().subtract(7, 'day').format();
      vm.year = moment().year();

      cargar();

      function cargar () {
        var min_stock = notification_min_stock.queryFresh();
        var max_stock = notification_max_stock.queryFresh();
        var venta_deuda = notification_factura_venta_deuda.queryFresh({'fecha': vm.fecha});
        var compra_deuda = notification_factura_compra_deuda.queryFresh({'fecha': vm.fecha});
        var mensajes = messageActive.queryFresh();
        var inven = inventario.getFresh({
          'year': vm.year
        });
        $q.all([min_stock.$promise, max_stock.$promise, venta_deuda.$promise, compra_deuda.$promise, mensajes.$promise, inven.$promise]).then(function(data){
          vm.listMin_stock = data[0];
          vm.listMax_stock = data[1];
          vm.listFacturaVenta = data[2];
          vm.listaFacturaCompra = data[3];
          vm.listaMensajes = data[4];
          console.log("Inventario", data[5]);
        });
      }

      function openNotification (lista, tipo) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Notification.html',
          controller: 'NotificationController',
          size: 'lg',
          controllerAs: 'vm',
          backdrop: false,
          resolve: {
            origin: function () {
              return {
                'origin':'main',
                'lista': lista,
                'tipo': tipo
              };
            }
          }
        });
      }
  }


  function NotificationController ($uibModalInstance, origin) {
    var vm = this;
    vm.tipo = origin.tipo;
    vm.lista = origin.lista;
    vm.search ="";
    console.log("Notificaciones ", origin);
    console.log("tipo "+ vm.tipo);


    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
