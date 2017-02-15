'use strict';

  angular.module('frontEndApp')
    .factory('messageResource', messageResource)
    .factory('messageActive', messageActive)
    .factory('message', message);


    function messageActive (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/message_active');
    }

    function message (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/message');
    }

    function messageResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/message/:id' ,{id: '@id'});
    }
