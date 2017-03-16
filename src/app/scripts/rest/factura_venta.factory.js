'use strict';

  angular.module('frontEndApp')
    .factory('factura_venta', factura_venta)
    .factory('factura_ventaResource', factura_ventaResource)
    .factory('factura_venta_pagos', factura_venta_pagos)
    .factory ('cuenta_cobrar', cuenta_cobrar)
    .factory ('Total_cobrar',Total_cobrar);

    function factura_venta (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_venta');
    }

    function factura_ventaResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_venta/:id' ,{id: '@id'});
    }

    function cuenta_cobrar (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuenta_cobrar');
    }

    function Total_cobrar (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuenta_cobrar/monto');
    }

    function factura_venta_pagos (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/factura_venta/:id/pagos' ,{id: '@id'});
    }
