'use strict';

  angular.module('frontEndApp')
    .factory('bankResource',bankResource)
    .factory('bank', bank);

    function bank (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/bank');
    }

    function bankResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/bank/:id' ,{id: '@id'});
    }
