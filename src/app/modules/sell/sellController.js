'use strict';

angular.module('frontEndApp')
  .controller('sellController', sellController)
  .controller('sellAddPayController', sellAddPayController);

  function sellController ($log, authUser,$rootScope, $uibModal, toastr,factura_venta, clientResource) {
      var vm = this;
      vm.searchClient = searchClient;
      vm.changeClient = changeClient;
      vm.deleteDetail = deleteDetail;
      vm.countTotal = countTotal;
      vm.open_add_pago = open_add_pago;
      vm.open_create_client = open_create_client;
      vm.backSell = backSell;
      vm.pagar = pagar;
      vm.facturar = facturar;
      vm.product_search = ""; /*Producto que se va a buscar*/
      vm.ListType = [
        {'sigla':"V", 'name' : 'Venezolano'},
        {'sigla':"J", 'name' : 'Jurídico'},
        {'sigla':"E", 'name' : 'Extranjero'},
        {'sigla':'G', 'name' : 'Gubernamental'}
      ]

      /*esto es para activar o desactivar los botones de abajo*/
      vm.btn = {
        'pagar': false,
        'facturar': false
      }

      /*Lista de pagos*/
      vm.tipos_pago = {
        'lista': [{'id':"1", 'name' : 'Contado'},{'id':"2", 'name' : 'Credito'}],
        'tipo': "1"
      }
      /*info del cliente*/
      vm.client = {
        'id': '23591017',
        'nombre': '',
        'tipo': 'Venezolano',
        'isLoad': false,
        'cedula': '',
        'loading': false
      };

      /*Monto que se muestra abajo total y cancelado*/
      vm.factura = {
        'total': 0,
        'cancelado': 0,
        'isloadin': false
      };

      /**/
      vm.listapagos = [];

      /*productos a facturar*/
      vm.detalles_factura = [];

      function backSell () {
        vm.btn.pagar = false;
        vm.btn.facturar = false;
      }

      /*empezar a agregar los pagos*/
      function pagar () {
        console.log("cantidad de productos "+ Object.keys(vm.detalles_factura).length);
        if (!vm.client.isLoad) {
          toastr.info('Debe agregar un cliente', 'Información');
          return;
        } else if(Object.keys(vm.detalles_factura).length<1) {
          toastr.info('Debe seleccionar algun producto', 'Información');
          return;
        }

        vm.btn.pagar = true;
        vm.btn.facturar = true;
      }

      function facturar () {
        vm.factura.isloading = true;
        vm.save = {
          'monto_total': vm.factura.total,
          'monto_cancelado': vm.factura.cancelado,
          'client_id': vm.client.id,
          'status': vm.tipos_pago.tipo,
        }

        if (vm.tipos_pago.tipo =="1") { /*Pagando de contado*/
            if (vm.factura.total>vm.factura.cancelado) {
              toastr.info("Debe pagar la totalidad de la factura", "Información");
              vm.factura.isloading = false;
              return;
            }
          vm.save.fecha_pago= moment().format('YYYY-MM-DD HH:mm')
        }
        if (vm.tipos_pago.tipo =="2") {
            if (vm.factura.total== vm.factura.cancelado) {
              toastr.info("Seleccione pago de contado", "Información");
              vm.factura.isloading = false;
              return;
            }
        }

        vm.ListType.forEach(function (data){
          if (data.name==vm.client.tipo) {
            vm.save.client_id = data.sigla+"-"+vm.client.id;
          }
        })

        vm.save.detalles = JSON.stringify(vm.detalles_factura);
        vm.save.pagos = JSON.stringify(vm.listapagos);

        factura_venta.save(vm.save,
          function (data) {
            console.log(data);
            toastr.success("Factura guardada con exito");
            vm.factura.isloading = false;
          },
          function (err) {
            toastr.error("Error del servidor");
            console.log(err);
            vm.factura.isloading = false;
          });
        console.log("facturando", vm.save);
      }

      /*borra el cliente que esta actualmente*/
      function changeClient () {
        vm.client.isLoad = false;
        vm.client.nombre = "";
        vm.client.cedula = "";
        console.log("cambiando el cliente");
      }

      /*Busca el cliente*/
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
                if (err.status=404) { /*Si el cliente no existe abre la modal para crearlo*/
                  open_create_client ();
                }
              vm.client.loading = false;
            });
        }
      }

      /*abre la modal de buscar productos*/
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

      /*Calcula el total pagado y total a facturar*/
      function countTotal() {
        vm.factura.total = 0;
        vm.factura.cancelado = 0;
        vm.detalles_factura.forEach(function(detalle){
           vm.factura.total = vm.factura.total + (detalle.cantidad*detalle.precio_venta);
        })
        vm.listapagos.forEach(function (pago){
          vm.factura.cancelado = vm.factura.cancelado + pago.monto;
        });
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
                'cancelado': vm.factura.cancelado,
                'listapagos': vm.listapagos
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

      /*Verifica que no se pase del stock*/
      vm.validarStock = function (detalle, evento) {
        console.log("cantidad "+ detalle.cantidad);
        if (evento == 'leave') {
          if (detalle.cantidad==null) {
            detalle.cantidad=1;
          }
        } else {
          if (typeof(detalle.cantidad)=='undefined') {
            detalle.cantidad = parseInt(detalle.stock);
            toastr.warning("El stock del producto es de: " +detalle.stock,"Advertencia");
          }
        }
        countTotal();
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
              if (detalle.cantidad < detalle.stock) {
                detalle.cantidad ++;
              } else {
                toastr.warning("El stock del producto es de: " +detalle.stock,"Advertencia");
              }
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

      $rootScope.$on('Sell_add_pay', function(event, data) {
        vm.listapagos = data;
        countTotal();
      });
  };

  function sellAddPayController ($uibModalInstance,$q, origin, toastr, $rootScope) {
    var vm =this;
    vm.status= "pagar";
    vm.isloading = false;
    vm.pago = 0;
    if (origin.origin=="sell") {
      console.log("vengo de factura venta");
      vm.total = origin.total;
      vm.cancelado = origin.cancelado;
      vm.listapagos = angular.copy(origin.listapagos);
      console.log(origin);
    }


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
        vm.calcular();
      }
    }

    vm.calcular = function(){
      vm.cancelado = 0;
      vm.listapagos.forEach(function (pago){
        vm.cancelado = vm.cancelado + pago.monto;
      });
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }

    vm.save = function () {
      vm.isloading = true;
      if (vm.cancelado>vm.total) {
        toastr.info ('El monto cancelado no debe exceder el monto total');
        vm.isloading = false;
        return;
      }
      $rootScope.$broadcast('Sell_add_pay', vm.listapagos);
      $uibModalInstance.dismiss('cancel');
      vm.isloading = false;
    }

    vm.deletePago = function (pago) {
      var count = 0;
      pago.tipo = "";
      pago.monto ="";
      vm.listapagos.forEach(function (detalle){
        if (detalle.tipo=="") {
          vm.listapagos.splice(count,1);
        }
        count++;
      });
      vm.calcular();
    }
  }
