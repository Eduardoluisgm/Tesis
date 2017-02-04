'use strict';

angular.module('frontEndApp')
  .controller('MessagesInformationController', MessagesInformationController)
  .controller('MessagesController', MessagesController);

  function MessagesController ($log, authUser,$rootScope, toastr, message, $q, $uibModal, messageResource) {
      var vm = this;
      vm.listaMensajes = [];
      vm.pagination = [];
      vm.changePage=changePage;
      vm.openInformation = openInformation;
      vm.search = search;
      vm.reload = reload;
      vm.delete = deleteMessage;
      vm.status = "Normal";
      vm.Buscar = {
        'busqueda':"",
        'actual':"",
        'buscando': false
      }

      cargar();

      function cargar () {
        var mensajes = message.getFresh({page:1});
        $q.all([mensajes.$promise]).then(function(data){
            vm.listaMensajes = data[0].data;
            vm.pagination.current_page = data[0].current_page;
            vm.pagination.per_page = data[0].per_page;
            vm.pagination.total = data[0].total;
            vm.pagination.last_page = data[0].last_page;
        });
      }

      function deleteMessage (mensaje_id) {
        console.log("estoy eliminando "+ mensaje_id);
        messageResource.delete({'id': mensaje_id},
          function success (data) {
            toastr.success('Eliminado con exito');
            changePage(vm.pagination.current_page);
          }, function error (err) {

          }
        );
      }

      function search () {
        if (vm.Buscar.actual) {
          vm.Buscar.busqueda = vm.Buscar.actual;
          vm.status = "Busqueda";
          console.log("entre aqui")
          changePage(1);
        }
        console.log(vm.Buscar);
      }

      function reload () {
        vm.Buscar.busqueda = "";
        vm.status = "Normal";
        changePage(1);
      }

      function changePage (number) {
        if (vm.status=="Normal") {
          var mensajes = message.getFresh({page:number});
          $q.all([mensajes.$promise]).then(function(data){
              vm.listaMensajes = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Normal";
              vm.Buscar.buscando=false;
          });
        }
        console.log("status "+ vm.status);
        if (vm.status=="Busqueda") {
          var mensajes = message.getFresh({page:number, 'search': vm.Buscar.busqueda});
          $q.all([mensajes.$promise]).then(function(data){
              vm.listaMensajes = data[0].data;
              vm.pagination.current_page = data[0].current_page;
              vm.pagination.per_page = data[0].per_page;
              vm.pagination.total = data[0].total;
              vm.pagination.last_page = data[0].last_page;
              vm.status = "Busqueda";
              vm.Buscar.buscando=true;
          });
        }
      }


      function openInformation (mensaje) {
        console.log("ver informacion ", mensaje);
        mensaje.status = 0;
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Mensajes.html', /*Llamo al template donde usare lamodal*/
          controller: 'MessagesInformationController', /*nombre del controlador de la modal*/
          controllerAs: 'vm',
          backdrop: false,
          resolve: {
            mensaje_id: function () {
              return mensaje.id;
            }
          }
        });
      }
  }

  function MessagesInformationController($uibModalInstance,$q, mensaje_id, messageResource) {
    var vm = this;
    vm.status="ver";
    vm.message = {};

    console.log("En Modal "+ mensaje_id);

    messageResource.get({'id': mensaje_id},
      function success (data) {
        vm.message = data;
      }, function error (err) {

      }
    );

    messageResource.patch({
      'id': mensaje_id,
      'status': 0
    },
      function success (data) {
      }, function error (err) {

      }
    );


    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
