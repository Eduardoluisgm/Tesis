'use strict';

  angular.module('frontEndApp')
    .factory('clientResource', clientResource)
    .factory('clientEdit', clientEdit)
    .factory('clientActive', clientActive)
    .factory('client', client);

    function client (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/client');
    }

    function clientActive (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/clientActive');
    }

    function clientResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/client/:cedula' ,{cedula: '@cedula'});
    }

    function clientEdit (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/client/:oldcedula' ,{oldcedula: '@oldcedula'});
    }
