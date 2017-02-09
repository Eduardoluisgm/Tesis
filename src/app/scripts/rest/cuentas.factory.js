'use strict';

  angular.module('frontEndApp')
    .factory('cuentaResource', cuentaResource)
    .factory('cuentaBanco', cuentaBanco)
    .factory('cuenta_pagos_delete', cuenta_pagos_delete)
    .factory('cuenta_pagosResource', cuenta_pagosResource);

    function cuentaBanco (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuentas');
    }

    function cuentaResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuentas/:id' ,{id: '@id'});
    }

    function cuenta_pagosResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuentas_pagos/:cuenta_id' ,{cuenta_id: '@cuenta_id'});
    }

    function cuenta_pagos_delete (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/cuentas_pagos/:id' ,{id: '@id'});
    }
