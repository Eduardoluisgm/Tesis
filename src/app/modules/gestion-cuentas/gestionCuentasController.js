'use strict';

angular.module('frontEndApp')
  .controller('Cuenta_pagosCreateController', Cuenta_pagosCreateController)
  .controller('gestionCuentasController', gestionCuentasController);

  function gestionCuentasController ($log, authUser,$rootScope,$q,cuentaBanco,toastr,$uibModal, cuenta_pagosResource, cuenta_pagos_delete, cuentaResource) {
      var vm = this;
      vm.listaCuentas = [];
      vm.cuenta_id = "";
      vm.search = search;
      vm.changePage=changePage;
      vm.deleteMovimiento = deleteMovimiento;
      vm.pagination = {};
      vm.status = "Normal";
      vm.options = {
        'saldo': 0,
        'Buscando':false,
        'isLoading': false,
        'cuenta': {
          'id':"",
          'banco': "",
          'nroCuenta': ""
        }
      };
      vm.openCreate = openCreate;

      cargar();

      function cargar () {
        cuentaBanco.queryFresh(
          function success (data) {
            vm.listaCuentas = data;
            console.log("Lista de cuentas ", vm.listaCuentas);
          }, function error (err) {

          }
        )
      }

      /*eliminar un movimiento*/
      function deleteMovimiento (movimiento_id) {
        cuenta_pagos_delete.delete({'id':movimiento_id},
          function success (data) {
            toastr.success('Movimiento eliminado con exito');
            changePage(vm.pagination.current_page);
          },
          function error (err) {

          }
        )
      };

      /*Buscar los movimientos de una cuenta*/
      function search () {
        if (vm.cuenta_id) {
          vm.status = "Normal";
          vm.listaCuentas.forEach(function(cuenta){
            if (cuenta.id==vm.cuenta_id) {
              vm.options.cuenta.id = cuenta.id;
              vm.options.cuenta.banco = cuenta.bank.nombre;
              vm.options.cuenta.nroCuenta = cuenta.numero;
              vm.options.Buscando = true;
            }
          });
          vm.options.isLoading=true;
          changePage(1);
        }
      };

      function changePage (number) {
        if (vm.status=="Normal") {
          var cuenta=cuentaResource.getFresh({'id':vm.options.cuenta.id});
          var Movimiento = cuenta_pagosResource.getFresh({page:number, 'cuenta_id': vm.options.cuenta.id});
          $q.all([Movimiento.$promise, cuenta.$promise]).then(function(data){
              vm.listaMovimientos = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.options.saldo = data[1].saldo;
              vm.status = "Normal";
              vm.options.isLoading=false;
          });
        }
      }


      function openCreate (){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Cuentas_Banco_Movimientos.html',
          controller: 'Cuenta_pagosCreateController',
          controllerAs: 'vm',
          backdrop: false,
          resolve: {
            origin: function () {
              return {
                'origin':'gestion_cuentas'
              };
            }
          }
        });
      }

      $rootScope.$on('changeGestionCuenta', function() {
        if (vm.options.Buscando) {
          changePage(vm.pagination.current_page);
        }
      });
  }


  function Cuenta_pagosCreateController ($uibModalInstance,$q,toastr, $rootScope, origin, cuentaBanco, cuenta_pagosResource) {
    var vm = this;
    vm.status="crear";
    vm.isloading = false;
    vm.openDate = false;
    vm.saldo = 0;
    vm.listaCuentas = [];
    vm.registro = {
      'cuenta_id':'',
      'tipo':'Ingreso',
      'fecha_pago': new Date(),
      'fecha': new Date (),
      'descripcion': '',
      'referencia':'Nota debito',
      'monto':0
    };

    vm.ListReferencia = [
      {'id':"Cheque", 'name' : 'Cheque'},
      {'id':"Nota debito", 'name' : 'Nota debito'},
      {'id':"Nota credito", 'name' : 'Nota credito'},
      {'id':'Transferencia', 'name' : 'Transferencia'}
    ];

    vm.ListType = [
      {'id':"Ingreso", 'name' : 'Ingreso'},
      {'id':"Egreso", 'name' : 'Egreso'}
    ];

    vm.changeCuenta = function () {
      vm.listaCuentas.forEach(function(cuenta){
        if (cuenta.id==vm.registro.cuenta_id) {
          vm.saldo = cuenta.saldo;
        }
      });
    }

    cuentaBanco.queryFresh(
      function success (data) {
        vm.listaCuentas = data;
        console.log("Lista de cuentas ", vm.listaCuentas);
      }, function error (err) {

      }
    );

    /**/
    vm.solonumeros = function(event) {
      if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
        event.preventDefault();
      }
    }

    vm.changePrecio = function () {
      if (vm.registro.monto>100000000000) {
        vm.registro.monto = 100000000000;
      }
    }

    vm.open_fecha_ingreso = function() {
      vm.openDate = !vm.openDate;
    };

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    };

    vm.save = function () {
      if (vm.registro.monto<0.1) {
        toastr.info('El Monto debe ser mayor a 0');
        return;
      };
      console.log("Mando a guardar ", vm.registro);
      vm.isloading = true;
      vm.registro.fecha_pago = moment(vm.registro.fecha).format('YYYY-MM-DD HH:mm');
      cuenta_pagosResource.save(vm.registro,
        function success (data) {
          toastr.success('Movimiento registrado con exito');
          vm.isloading = false;
          $rootScope.$broadcast('changeGestionCuenta');
          $uibModalInstance.dismiss('cancel');
        },
        function error (err) {
          vm.isloading = false;
        }
      );
    }

  }
