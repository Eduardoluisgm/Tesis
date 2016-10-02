'use strict';

angular.module('frontEndApp')
  .controller('MenuController', MenuController);

  function MenuController () {
      var vm = this;
      vm.name = "Eduardo";
      console.log("Menu");
  };
