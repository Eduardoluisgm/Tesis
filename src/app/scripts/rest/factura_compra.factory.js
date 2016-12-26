'use strict';

  angular.module('frontEndApp')
    .factory('cuenta_pagar', cuenta_pagar)
    .factory('factura_compra_pagos', factura_compra_pagos)
    .factory('factura_compra', factura_compra);

    function factura_compra (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_compra');
    }

    function cuenta_pagar (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuenta_pagar');
    }

    function factura_compra_pagos (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_compra/:id/pagos' ,{id: '@id'});
    }
