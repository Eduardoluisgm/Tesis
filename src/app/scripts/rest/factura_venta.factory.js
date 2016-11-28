'use strict';

  angular.module('frontEndApp')
    .factory('factura_venta', factura_venta)
    .factory ('cuenta_cobrar', cuenta_cobrar);

    function factura_venta (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_venta');
    }

    function cuenta_cobrar (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuenta_cobrar');
    }
