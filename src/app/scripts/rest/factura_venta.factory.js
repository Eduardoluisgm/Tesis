'use strict';

  angular.module('frontEndApp')
    .factory('factura_venta', factura_venta);

    function factura_venta (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_venta');
    }
