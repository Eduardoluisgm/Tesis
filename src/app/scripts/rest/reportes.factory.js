'use strict';

  angular.module('frontEndApp')
    .factory('Ganancias', Ganancias)
    .factory('Perdidas', Perdidas)
    .factory('ClientemayoresCompras', ClientemayoresCompras)
    .factory('ClienteVolumenCompras', ClienteVolumenCompras)
    .factory('ProveedormayoresCompras', ProveedormayoresCompras)
    .factory('ProveedorVolumenCompras', ProveedorVolumenCompras)
    .factory('ProductoComprado', ProductoComprado)
    .factory('ProductoVendido', ProductoVendido);

    function Ganancias (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/Ganancias');
    }

    function Perdidas (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/Perdidas');
    }

    function ProductoVendido (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ProductosMasVendido');
    }

    function ProductoComprado (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ProductosMasComprado');
    }

    function ClientemayoresCompras (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ClientemayoresCompras');
    }

    function ClienteVolumenCompras (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ClienteVolumenCompras');
    }

    function ProveedormayoresCompras (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ProveedormayoresCompras');
    }

    function ProveedorVolumenCompras (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/ProveedorVolumenCompras');
    }
