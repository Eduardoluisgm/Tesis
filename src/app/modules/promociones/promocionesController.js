'use strict';

angular.module('frontEndApp')
  .controller('promocionesCreateController', promocionesCreateController)
  .controller('promocionesController', promocionesController);

  function promocionesController ($log, authUser,$rootScope, $uibModal, promotion, ApiUrl, $q, promotionResource, toastr) {
      var vm = this;
      vm.openCreate = openCreate;
      vm.changePage = changePage;
      vm.DeletePromocion = DeletePromocion;
      vm.listpromotion = [];
      vm.ApiUrl = ApiUrl;
      vm.pagination = {};

      console.log(vm.ApiUrl);

      promotion.getFresh({'page':1},
        function success (data) {
          vm.listpromotion = data.data;
          vm.pagination.current_page = data.current_page;
          vm.pagination.per_page = data.per_page;
          vm.pagination.total = data.total;
          vm.pagination.last_page = data.last_page;
          vm.listpromotion.forEach(function(promocion){
            promocion.dire = vm.ApiUrl + '/images/'+ promocion.url;
            console.log(promocion.dire);
          });
        }, function error (error) {
        }
      );

      function DeletePromocion (id) {
        console.log("id de promocioon "+ id);
        promotionResource.delete({'id':id},
          function success (data){
            toastr.success('Eliminado con exito');
            changePage(vm.pagination.current_page);
          }, function error(err){

          }
        );
      }

      function changePage (number) {
        var promo = promotion.getFresh({'page':number});
        $q.all([promo.$promise]).then(function(data){
          vm.listpromotion = data[0].data;
          vm.pagination.current_page = data[0].current_page;
          vm.pagination.per_page = data[0].per_page;
          vm.pagination.total = data[0].total;
          vm.pagination.last_page = data[0].last_page;
          vm.listpromotion.forEach(function(promocion){
            promocion.dire = vm.ApiUrl + '/images/'+ promocion.url;
            console.log(promocion.dire);
          });
        });
      }


      function openCreate () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/Modal_Promotion.html',
          controller: 'promocionesCreateController',
          controllerAs: 'vm',
          backdrop: false,
          resolve: {
            origin: function () {
              return {
                'origin':'promocion'
              };
            }
          }
        });
      }

      $rootScope.$on('reloadPromotion', function() {
        changePage(vm.pagination.current_page);
      });
  };

  function promocionesCreateController ($uibModalInstance,$q,toastr, $rootScope, origin, promotion, Upload) {
    var vm = this;
    vm.promocion = {
      'titulo':'',
      'descripcion':''
    };

    vm.cancel= function() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.save = function() {
      if (typeof(vm.promocion.file)=='undefined') {
        toastr.warning('Debe seleccionar una imagen');
        return;
      }
      console.log("estoy guardando promocion" , vm.promocion);

      vm.isloading = true;

      Upload.upload({
        url: 'http://localhost:8000/promotion',
        data: {
          file: vm.promocion.file,
          titulo: vm.promocion.titulo,
          descripcion: vm.promocion.descripcion
        }
      }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            vm.isloading = false;
            $rootScope.$broadcast('reloadPromotion');
            $uibModalInstance.dismiss('cancel');
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            vm.isloading = false;
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

    }
  }
