'use strict';

angular.module('frontEndApp')
  .controller('indexController', indexController);

  function indexController () {
      var vm = this;
      vm.name = "Eduardo";
      vm.caguita= "caguita.";
      console.log("hello soy index");
  };
