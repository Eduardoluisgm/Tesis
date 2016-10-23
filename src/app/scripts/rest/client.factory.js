'use strict';

  angular.module('frontEndApp')
    .factory('clientResource', clientResource)
    .factory('clientEdit', clientEdit)
    .factory('client', client);

    function client (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/client');
    }

    function clientResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/client/:cedula' ,{cedula: '@cedula'});
    }

    function clientEdit (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/client/:oldcedula' ,{oldcedula: '@oldcedula'});
    }
