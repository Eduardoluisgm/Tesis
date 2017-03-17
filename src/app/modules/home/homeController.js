'use strict';

angular.module('frontEndApp')
  .controller('homeController', homeController);

  function homeController ($log, authUser,$rootScope, message, toastr, promotion, ApiUrl) {
    var vm = this;
    console.log("Home");
    vm.login = login;
    vm.isloading = false;
    vm.loadingMsj = false;
    vm.ApiUrl=ApiUrl;
    vm.listpromotion = [];
    vm.option = 1;
    vm.credential = {
      'cedula': "",
      'password': ""
    };
    vm.message = {
      'email':"",
      'message': ""
    }

    vm.sendMessage =  function () {
      vm.loadingMsj = true;
      console.log("Guardando ", vm.message);
      message.save(vm.message,
        function success () {
          vm.loadingMsj = false;
          vm.message.message = "";
          toastr.success("Mensaje enviado");
        },
        function error () {
          vm.loadingMsj = false;
        }
      )
    }

    /*hace la peticion al login*/
    function login () {
      vm.isloading= true;
      authUser.loginApi(vm.credential);
    };

    $rootScope.$on('errorLogin', function() {
      vm.isloading = false;
    });


    /*Carrousel*/
    vm.carousel = {
      'myInterval': 3000,
      'noWrapSlides': false,
      'slides': [],
      'active': 0
    }

    addSlides();

    /*Agregar Imagenes al carrousel*/
    function addSlides () {
      vm.carousel.slides = [
        {'id':0, 'titulo': 'Bienvenido', 'image': 'images/productos/cacique.jpg'}
      ];
      promotion.queryFresh(
        function success (data) {
          vm.listpromotion = data;
          var count = 1;
          vm.listpromotion.forEach(function(promocion){
            promocion.dire = vm.ApiUrl + '/images/'+ promocion.url;
            console.log(promocion.dire);
            vm.carousel.slides.push({
              'id':count,
              'descripcion':promocion.descripcion,
              'titulo':promocion.titulo,
              'image': promocion.dire
            });
            count++;
          });


        }, function error (error) {
        }
      );
    }


    $rootScope.$broadcast('HideMenu');
  }
