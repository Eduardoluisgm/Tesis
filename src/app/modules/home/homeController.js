'use strict';

angular.module('frontEndApp')
  .controller('homeController', homeController);

  function homeController ($log, authUser,$rootScope, message, toastr) {
    var vm = this;
    console.log("Home");
    vm.login = login;
    vm.isloading = false;
    vm.loadingMsj = false;
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
        {'id':0, 'text': 'prueba', 'image': 'images/productos/cacique500.jpg'},
        {'id':1, 'text': 'segundo', 'image': 'images/productos/0.jpg'},
        {'id':2, 'text': 'segundo', 'image': 'images/productos/1.jpg'},
        {'id':3, 'text': 'segundo', 'image': 'images/productos/3.jpg'},
        {'id':4, 'text': 'segundo', 'image': 'images/productos/4.jpg'}
      ]
    }


    $rootScope.$broadcast('HideMenu');
  }
