'use strict';

angular.module('frontEndApp')
  .controller('sellController', sellController);

  function sellController ($log, authUser,$rootScope, $uibModal, toastr, clientResource) {
      var vm = this;
      vm.searchClient = searchClient;
      vm.changeClient = changeClient;
      vm.open_create_client = open_create_client;
      vm.ListType = [
        {'sigla':"V", 'name' : 'Venezolano'},
        {'sigla':"J", 'name' : 'Jurídico'},
        {'sigla':"E", 'name' : 'Extranjero'},
        {'sigla':'G', 'name' : 'Gubernamental'}
      ]

      vm.client = {
        'id': '23591017',
        'nombre': '',
        'tipo': 'Venezolano',
        'isLoad': false,
        'cedula': '',
        'loading': false
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

      /*Solo numeros*/
      vm.solonumeros = function(event) {
        if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46) {} else {
          event.preventDefault();
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
  };
