'use strict';

angular.module('frontEndApp')
  .controller('homeController', homeController);

  function homeController ($log, authUser,$rootScope) {
    var vm = this;
    console.log("Home");
    vm.login = login;
    vm.isloading = false;
    vm.option = 1;
    vm.credential = {
      'cedula': "",
      'password': ""
    };

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
        {'id':0, 'text': 'prueba', 'image': 'images/productos/cacique500.jpg'},
        {'id':1, 'text': 'segundo', 'image': 'images/productos/cocacola.png'}
      ]
      console.log(vm.carousel.slides);
    }


    $rootScope.$broadcast('HideMenu');
  }
