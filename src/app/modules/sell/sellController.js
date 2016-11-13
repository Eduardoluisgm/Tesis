'use strict';

angular.module('frontEndApp')
  .controller('sellController', sellController);

  function sellController ($log, authUser,$rootScope) {
      var vm = this;
      console.log("Sell controller");
  };
