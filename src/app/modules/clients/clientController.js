'use strict';

angular.module('frontEndApp')
  .controller('clientController', clientController);

  function clientController () {
      var vm = this;
      vm.name = "Eduardo";
      vm.caguita= "caguita.";
      console.log("hello2");
  };
