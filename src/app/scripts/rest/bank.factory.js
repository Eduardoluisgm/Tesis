'use strict';

  angular.module('frontEndApp')
    .factory('bankResource',bankResource)
    .factory('bankActive', bankActive)
    .factory('bank', bank);

    function bank (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/bank');
    }

    function bankActive (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/bank_active');
    }

    function bankResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/bank/:id' ,{id: '@id'});
    }
