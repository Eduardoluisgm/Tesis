'use strict';

  angular.module('frontEndApp')
    .factory('messageResource', messageResource)
    .factory('message', message);


    function message (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/message');
    }

    function messageResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/message/:id' ,{id: '@id'});
    }
