'use strict';

  angular.module('frontEndApp')
    .factory('role', role);

    function role ($resource, ApiUrl) {
      return $resource(ApiUrl+'/role');
    }
