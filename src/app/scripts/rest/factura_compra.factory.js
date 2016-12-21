'use strict';

  angular.module('frontEndApp')
    .factory('factura_compra', factura_compra);

    function factura_compra (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_compra');
    }
