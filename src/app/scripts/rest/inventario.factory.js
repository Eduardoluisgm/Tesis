'use strict';

  angular.module('frontEndApp')
    .factory('inventarioYear', inventarioYear)
    .factory('inventario', inventario);

    function inventario (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/inventario');
    }

    function inventarioYear (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/inventario/fecha');
    }
