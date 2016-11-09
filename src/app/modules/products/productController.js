'use strict';

angular.module('frontEndApp')
  .controller('productController', productController)
  .controller('ProductInformationController', ProductInformationController)
  .controller('ProductEditController', ProductEditController)
  .controller('ProductCreateController',ProductCreateController);

  function productController (product,$q,$uibModal, $rootScope, productEdit, toastr) {
      var vm = this;
      vm.changePage=changePage;
      vm.openCreate = openCreate;
      vm.openEdit = openEdit;
      vm.openInformation = openInformation;
      vm.changeStatus= changeStatus;
      vm.listaProductos = [];
      vm.pagination = [];

      cargar();

      function cargar () {
        var productos = product.getFresh({page:1});
        $q.all([productos.$promise]).then(function(data){
            vm.listaProductos = data[0].data;
            console.log(data[0].data);
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      function changeStatus(codigo, status) {
        if (status==1) {
          status= "0";
        } else {
          status= "1";
        }
        productoEdit.patch({
          'codigo':codigo,
          'oldcodigo':codigo,
          'status':status
        }, function (data) {
            changePage(vm.pagination.current_page);
            toastr.success("Cambio de estado exitoso", "Información");
        }, function (err) {})
      }

      function changePage (number) {
        var productos = product.getFresh({page:number});
        $q.all([productos.$promise]).then(function(data){
            vm.listaProductos = data[0].data; /*aqui habias dejado lista clientes*/
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      /*Abre la modal de crear usuario*/
      function openCreate () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Product.html', /*Llamo al template donde usare lamodal*/
          controller: 'ProductCreateController', /*nombre del controlador de la modal*/
          controllerAs: 'vm' /*Importante colocar esto*/
        });
      }

      function openInformation (product) {
        console.log("ver informacion ", product);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Product.html', /*Llamo al template donde usare lamodal*/
          controller: 'ProductInformationController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: {
            product_id: function () {
              return product.codigo;
            }
          }
        });
      }

      /*Abre la modal de editar usuario*/
      function openEdit (codigo) {
        console.log("ver informacion ", codigo);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Product.html', /*Llamo al template donde usare lamodal*/
          controller: 'ProductEditController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          resolve: { /*asi se pasa un parametro**/
            product_id: function () {
              return codigo;
            }
          }
        });
      }

      $rootScope.$on('changeProduct', function() {
        console.log("Cambiando Producto");
        changePage(vm.pagination.current_page);
      });
  };

  /*Modal editar Usuario*/
  function ProductEditController ($uibModalInstance,$q, $rootScope, product_id ,productResource, productEdit, toastr) {
    var vm = this;
    vm.status = "actualizar";
    vm.isloading = false;
    vm.product= [];
    cargar();
    function cargar() {
      var producto = productResource.getFresh({'codigo':product_id});
      $q.all([producto.$promise]).then(function(data){
        vm.product = data[0];
        vm.product.oldcodigo = vm.product.codigo;
      });
    }

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function () {
      vm.isloading = true;
        productEdit.patch(vm.product,
          function (data) {
            vm.isloading = false;
            toastr.success("Producto actualizado correctamente", "Información");
            $rootScope.$broadcast('changeProduct');
            $uibModalInstance.dismiss('cancel');
          },
          function (err) {
            if (err.status==409) {
              toastr.info("Ya existe un producto con ese codigo", "Información");
            }
            vm.isloading = false;
          })
    }

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }
    vm.changeCodigo = function () {
      if (vm.product.codigo) {
        vm.product.codigo = parseInt(vm.product.codigo);
      }
    }
  }

  function ProductInformationController ($uibModalInstance,$q, $rootScope, productResource, toastr, product_id) {
    var vm= this;
    vm.status="ver";
    vm.product= [];
    console.log("product id "+ product_id);

    productResource.getFresh({
      'codigo': product_id
    }, function (data) {
        vm.product = data;
        console.log(vm.product);
    }, function (err) {
    });

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }

  function ProductCreateController ($uibModalInstance,$q,product,toastr, $rootScope) {
    var vm = this;
    vm.status="crear";
    vm.isloading = false;
    vm.product = {
      'codigo':"",
      'nombre':"",
      'precio_costo':"",
      'precio_venta':"",
      'stock':""
    }

    

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function () {
      console.log("estoy guardando");
      vm.isloading = true;
      vm.product.codigo = parseInt(vm.product.codigo);
      product.save(vm.product,
          function (data) {
            toastr.success("Producto registrado exitosamente");
            $rootScope.$broadcast('changeProduct');
            $uibModalInstance.dismiss('cancel');
            vm.isloading = false;
          }, function (err)  {
            if (err.status==409) {
              toastr.info("Ya existe un producto con ese codigo", "Información");
            }
            vm.isloading = false;
          }
      )
    }

    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }

    /*Evitar que la cedula comienze con cero*/
    vm.changeCodigo = function () {
      if (vm.product.codigo) {
        vm.product.codigo = parseInt(vm.product.codigo);
      }
    }
  }
