'use strict';

  angular.module('frontEndApp')
    .factory('client', client);

    function client (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/client');
    }
