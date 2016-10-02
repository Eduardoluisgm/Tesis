'use strict';

  angular.module('frontEndApp')
    .factory('user', user);

    function user ($resource, ApiUrl) {
      return $resource(ApiUrl+'/user');
    } 
