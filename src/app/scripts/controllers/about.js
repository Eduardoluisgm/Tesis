'use strict';

/**
 * @ngdoc function
 * @name frontEndApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontEndApp
 */
angular.module('frontEndApp')
  .controller('AboutCtrl', function () {
    console.log("aquiii");
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
