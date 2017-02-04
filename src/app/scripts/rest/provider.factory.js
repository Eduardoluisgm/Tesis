'use strict';

  angular.module('frontEndApp')
    .factory('providerResource', providerResource)
    .factory('providerActive', providerActive)
    .factory('providerEdit', providerEdit)
    .factory('provider', provider);

    function provider (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/provider');
    }

    function providerActive (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/providerActive');
    }

    function providerResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/provider/:rif' ,{rif: '@rif'});
    }

    function providerEdit (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/provider/:oldrif' ,{oldrif: '@oldrif'});
    }
