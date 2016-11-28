'use strict';

angular.module('frontEndApp')
  .controller('receivableController', receivableController);

  function receivableController ($log, authUser,$rootScope, cuenta_cobrar, $q) {
    var vm = this;
    vm.pagination = [];
    vm.listaCuentas = [];
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

    console.log("Cuentas por pagar");


   }
