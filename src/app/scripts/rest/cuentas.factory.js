'use strict';

  angular.module('frontEndApp')
    .factory('cuentaResource', cuentaResource)
    .factory('cuentaBanco', cuentaBanco);

    function cuentaBanco (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuentas');
    }

    function cuentaResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuentas/:id' ,{id: '@id'});
    }
