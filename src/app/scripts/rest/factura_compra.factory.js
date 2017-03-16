'use strict';

  angular.module('frontEndApp')
    .factory('cuenta_pagar', cuenta_pagar)
    .factory('factura_compraResource',factura_compraResource)
    .factory('factura_compra_pagos', factura_compra_pagos)
    .factory('Total_pagar', Total_pagar)
    .factory('factura_compra', factura_compra);

    function factura_compra (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_compra');
    }

    function factura_compraResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_compra/:id' ,{id: '@id'});
    }

    function Total_pagar (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuenta_pagar/monto');
    }

    function cuenta_pagar (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuenta_pagar');
    }

    function factura_compra_pagos (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_compra/:id/pagos' ,{id: '@id'});
    }
