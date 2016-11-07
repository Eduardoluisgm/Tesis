'use strict';

  angular.module('frontEndApp')
    .factory('productResource', productResource)
    .factory('productEdit', productEdit)
    .factory('product', product);

    function product (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product');
    }

    function productResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product/:codigo' ,{codigo: '@codigo'});
    }

    function productEdit (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product/:oldcodigo' ,{oldcodigo: '@oldcodigo'});
    }
