'use strict';

  angular.module('frontEndApp')
    .factory('notification_factura_venta_deuda', notification_factura_venta_deuda)
    .factory('notification_factura_compra_deuda', notification_factura_compra_deuda)
    .factory('notification_max_stock',notification_max_stock)
    .factory('notification_min_stock',notification_min_stock);

    function notification_min_stock (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/notification/min_stock');
    }

    function notification_max_stock (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/notification/max_stock');
    }

    function notification_factura_venta_deuda (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/notification/factura_venta_deuda');
    }

    function notification_factura_compra_deuda (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/notification/factura_compra_deuda');
    }
