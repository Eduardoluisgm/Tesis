'use strict';

  angular.module('frontEndApp')
    .factory('ClientemayoresCompras', ClientemayoresCompras)
    .factory('ClienteVolumenCompras', ClienteVolumenCompras)
    .factory('ProductoVendido', ProductoVendido);

    function ProductoVendido (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ProductosMasVendido');
    }

    function ClientemayoresCompras (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ClientemayoresCompras');
    }

    function ClienteVolumenCompras (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ClienteVolumenCompras');
    }
