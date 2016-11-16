'use strict';

angular.module('frontEndApp')
  .controller('sellController', sellController)
  .controller('sellAddPayController', sellAddPayController);

  function sellController ($log, authUser,$rootScope, $uibModal, toastr, clientResource) {
      var vm = this;
      vm.searchClient = searchClient;
      vm.changeClient = changeClient;
      vm.deleteDetail = deleteDetail;
      vm.countTotal = countTotal;
      vm.open_add_pago = open_add_pago;
      vm.open_create_client = open_create_client;
      vm.product_search = ""; /*Producto que se va a buscar*/
      vm.ListType = [
        {'sigla':"V", 'name' : 'Venezolano'},
        {'sigla':"J", 'name' : 'Jurídico'},
        {'sigla':"E", 'name' : 'Extranjero'},
        {'sigla':'G', 'name' : 'Gubernamental'}
      ]

      vm.tipos_pago = {
        'lista': [{'id':"1", 'name' : 'Contado'},{'id':"2", 'name' : 'Credito'}],
        'tipo': "1"
      }
      vm.client = {
        'id': '23591017',
        'nombre': '',
        'tipo': 'Venezolano',
        'isLoad': false,
        'cedula': '',
        'loading': false
      };

      vm.factura = {
        'total': 0,
        'cancelado': 0
      };

      vm.detalles_factura = [];

      function changeClient () {
        vm.client.isLoad = false;
        vm.client.nombre = "";
        vm.client.cedula = "";
        console.log("cambiando el cliente");
      }
      function searchClient () {
        if (vm.client.id) {
          vm.client.loading = true;
          vm.ListType.forEach(function(data){
              if (data.name==vm.client.tipo) {
                vm.client.cedula = data.sigla +"-"+vm.client.id;
              }
          });
          console.log("estoy pidiendo "+ vm.client.cedula);
          clientResource.getFresh({'cedula': vm.client.cedula},
            function (data) {
              if (data.status=="1") { /*Esta activo el cliente*/
                vm.client.isLoad = true;
                vm.client.nombre = data.name;
                vm.client.cedula = "";
              } else if (data.status=="0") {
                toastr.info("El cliente esta inactivo", "Información");
              }
              vm.client.loading = false;
            }, function (err) {
                if (err.status=404) {
                  open_create_client ();
                }
              vm.client.loading = false;
            });
        }
      }

      function open_search_product () {
        console.log("Buscando producto "+ vm.product_search);
        if (!vm.product_search) {
          console.log("estoy retornando");
          return;
        }

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Product.html',
          controller: 'ProductSearchController',
          controllerAs: 'vm',
          resolve: {
            origin: function () {
              return {
                'origin':'sell',
                'name': vm.product_search
              };
            }
          }
        });
      }

      function countTotal() {
        vm.factura.total = 0;
        vm.detalles_factura.forEach(function(detalle){
           vm.factura.total = vm.factura.total + (detalle.cantidad*detalle.precio_venta);
        })
      }

      function open_add_pago() {
        console.log("agregando el pago");
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Pago_Venta.html',
          controller: 'sellAddPayController',
          controllerAs: 'vm',
          resolve: {
            origin: function () {
              return {
                'origin':'sell',
                'total': vm.factura.total,
                'cancelado': vm.factura.cancelado
              };
            }
          }
        });
      }

      /*Abre la modal de crear cliente*/
      function open_create_client () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Client.html',
          controller: 'ClientCreateController',
          controllerAs: 'vm',
          resolve: {
            origin: function () {
              return {
                'origin':'sell',
                'cedula':vm.client.id,
                'tipo':vm.client.tipo
              };
            }
          }
        });
      }

      /*quitar un elemento de la lista de detalles de factura*/
      function deleteDetail (codigo) {
        var cont = 0;
        var position = 0;
        vm.detalles_factura.forEach(function(detalle){
            if (detalle.codigo==codigo){
              position = cont;
            }
          cont ++;
        });
        vm.detalles_factura.splice(position, 1);
        countTotal();
        console.log(codigo);
      }
      /*Solo numeros*/
      vm.solonumeros = function(event) {
        if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
          event.preventDefault();
        }
      }

      /*Buscar productos*/
      vm.search_product = function (event) {
        if (event.keyCode == 13) {
          open_search_product ();
        }
      }

      $rootScope.$on('Sell_create_client', function(event, data) {
          console.log("cree un usuario desde sell", data.data);
          vm.client.isLoad = true;
          vm.client.nombre = data.data.data.name;
          vm.client.tipo = data.data.data.tipo;
          vm.client.id = data.data.data.cedula.slice(2);
          console.log("cliente ", vm.client);
      });

      $rootScope.$on('Sell_add_product', function(event, data) {
        console.log(data);
        var bandera = false;
        vm.detalles_factura.forEach(function (detalle){
            if (detalle.codigo==data.codigo) {
              bandera = true;
              detalle.cantidad ++;
            }
        });
        if (!bandera) {
          console.log("nuevo");
          vm.detalles_factura.push({
            'codigo': data.codigo,
            'nombre': data.nombre,
            'precio_costo': data.precio_costo,
            'precio_venta': data.precio_venta,
            'stock': data.stock,
            'cantidad': 1
          })
        }

        countTotal();
      });
  };

  function sellAddPayController ($uibModalInstance,$q, origin) {
    var vm =this;
    vm.status= "pagar";
    vm.pago = 0;
    vm.total = origin.total;
    vm.cancelado = origin.cancelado;
    vm.listapagos = [];
    vm.ListType = {
      'lista': [{'id':"Efectivo", 'name' : 'Efectivo'},{'id':"Debito", 'name' : 'Debito'},{'id':"Credito", 'name' : 'Credito'}],
      'tipo': "Efectivo"
    }

    vm.add_pago = function() {
      if (vm.pago>0) {
        vm.listapagos.push({
          'tipo': vm.ListType.tipo,
          'monto': vm.pago
        })
      }
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }
  }
