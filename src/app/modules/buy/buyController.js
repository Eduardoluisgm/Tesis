'use strict';

angular.module('frontEndApp')
  .controller('buyController', buyController);

  function buyController ($log, authUser,$rootScope,$http,ApiUrl, providerResource, toastr, $uibModal, factura_compra) {
    var vm = this;
    vm.searchProvider = searchProvider;
    vm.changeProvider = changeProvider;
    vm.deleteDetail = deleteDetail;
    vm.open_add_pago = open_add_pago;
    vm.backBuy = backBuy;
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
    vm.provider = {
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
      'isloading': false
    };

    /**/
    vm.listapagos = [];

    /*productos a facturar*/
    vm.detalles_factura = [];

    function searchProvider() {
      console.log("buscando proveedor");
      if (vm.provider.id) {
        vm.provider.loading = true;
        vm.ListType.forEach(function(data){
            if (data.name==vm.provider.tipo) {
              vm.provider.cedula = data.sigla +"-"+vm.provider.id;
            }
        });
        console.log("estoy pidiendo "+ vm.provider.cedula);
        providerResource.getFresh({'rif': vm.provider.cedula},
          function (data) {
            if (data.status=="1") { /*Esta activo el cliente*/
              vm.provider.isLoad = true;
              vm.provider.nombre = data.nombre;
              vm.provider.cedula = "";
            } else if (data.status=="0") {
              toastr.info("El cliente esta inactivo", "Información");
            }
            vm.provider.loading = false;
          }, function (err) {
              if (err.status=404) { /*Si el cliente no existe abre la modal para crearlo*/
                open_create_provider ();
              }
            vm.provider.loading = false;
          });
      }
    }

    /*resetar la pantalla despes de facturar*/
    function limpiar() {
      vm.factura.total = 0,
      vm.factura.cancelado = 0,
      vm.tipos_pago.tipo =="1" /*de contado*/
      vm.detalles_factura=[]; /*borra los detalles de la factura*/
      vm.listapagos=[]; /*borra los pagos realizados*/
      vm.product_search="";
      vm.provider = {
        'id': '',
        'nombre': '',
        'tipo': 'Venezolano',
        'isLoad': false,
        'cedula': '',
        'loading': false
      };
      vm.btn.pagar = false;
      vm.btn.facturar = false;
    }

    /*borra el cliente que esta actualmente*/
    function changeProvider () {
      vm.provider.isLoad = false;
      vm.provider.nombre = "";
      vm.provider.cedula = "";
      console.log("cambiando el proveedor");
    }

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
    }

    function open_add_pago() {
      console.log("agregando el pago");
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Pago_Venta.html',
        controller: 'sellAddPayController',
        controllerAs: 'vm',
        backdrop: false,
        resolve: {
          origin: function () {
            return {
              'origin':'buy',
              'total': vm.factura.total,
              'cancelado': vm.factura.cancelado,
              'listapagos': vm.listapagos
            };
          }
        }
      });
    }


    /*empezar a agregar los pagos*/
    function pagar () {
      console.log("cantidad de productos "+ Object.keys(vm.detalles_factura).length);
      if (!vm.provider.isLoad) {
        toastr.info('Debe agregar un Proveedor', 'Información');
        return;
      } else if(Object.keys(vm.detalles_factura).length<1) {
        toastr.info('Debe seleccionar algun producto', 'Información');
        return;
      }
      vm.btn.pagar = true;
      vm.btn.facturar = true;
    }

    function backBuy () {
      vm.btn.pagar = false;
      vm.btn.facturar = false;
    }

    function open_create_provider () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/Modal_Provider.html',
        controller: 'ProviderCreateController',
        controllerAs: 'vm',
        backdrop: false,
        resolve: {
          origin: function () {
            return {
              'origin':'buy',
              'rif':vm.provider.id,
              'tipo':vm.provider.tipo
            };
          }
        }
      });
    }

    /*Buscar productos*/
    vm.search_product = function (event) {
      if (event.keyCode == 13) {
        open_search_product ();
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
        backdrop: false,
        resolve: {
          origin: function () {
            return {
              'origin':'buy',
              'name': vm.product_search
            };
          }
        }
      });
    }

    function facturar () {
      vm.factura.isloading = true;
      vm.save = {
        'monto_total': vm.factura.total,
        'monto_cancelado': vm.factura.cancelado,
        'provider_id': vm.provider.id,
        'status': vm.tipos_pago.tipo,
      }
      if (vm.factura.total<vm.factura.cancelado) {
        toastr.info("No puede cancelar mas del monto total", "Información");
        vm.factura.isloading = false;
        return;
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
        if (data.name==vm.provider.tipo) {
          vm.save.provider_id = data.sigla+"-"+vm.provider.id;
        }
      })

      vm.save.detalles = JSON.stringify(vm.detalles_factura);
      vm.save.pagos = JSON.stringify(vm.listapagos);

      factura_compra.save(vm.save,
        function (data) {
          toastr.success("Factura guardada con exito");
          Facturapdf(data.data.id);
          limpiar();
          vm.factura.isloading = false;
        }, function (err) {
          toastr.error("Error del servidor");
          vm.factura.isloading = false;
        }
      )
      console.log("facturando", vm.save);
    }

    function Facturapdf(factura_id) {
      console.log("id de la factura "+ factura_id);
      $http({
        url: ApiUrl + '/factura_compra/'+factura_id+'/pdf',
        method: 'GET',
        responseType: 'arraybuffer'
      }).success(function(data) {
        var file = new Blob([data], {
          type: 'application/pdf'
        });
        var fileURL = URL.createObjectURL(file);
        /*window.open(fileURL,'download_window');*/
        var link = document.createElement('a');
        link.download = 'Factura compra '+factura_id;
        link.target = '_blank';
        link.href = fileURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  }



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

    vm.validarStock = function (detalle, evento) {
      console.log("cantidad "+ detalle.cantidad);
      if (evento == 'leave') {
        if (detalle.cantidad==null) {
          detalle.cantidad=1;
        }
      } else {
        if (typeof(detalle.cantidad)=='undefined') {
          detalle.cantidad = 100000;
          toastr.warning("La cantidad maxima permitida es: 100mil","Advertencia");
        }
      }
      countTotal();
    }

    $rootScope.$on('Buy_create_provider', function(event, data) {
        console.log("cree un usuario desde buy", data.data);
        vm.provider.isLoad = true;
        vm.provider.nombre = data.data.data.nombre;
      //  vm.provider.tipo = data.data.data.tipo;
        vm.provider.id = data.data.data.rif.slice(2);
        console.log("proveedor ", vm.provider);
    });

    $rootScope.$on('Buy_add_pay', function(event, data) {
      vm.listapagos = data;
      countTotal();
    });

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }

    $rootScope.$on('Buy_add_product', function(event, data) {
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

  }
