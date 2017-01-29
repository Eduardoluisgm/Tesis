'use strict';

  angular.module('frontEndApp')
    .factory('productResource', productResource)
    .factory('productEdit', productEdit)
    .factory('product', product)
    .factory('productActive', productActive)
    .factory('productSearch', productSearch);

    function product (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product');
    }

    function productActive (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/productActive');
    }

    function productResource (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product/:codigo' ,{codigo: '@codigo'});
    }

    function productEdit (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product/:oldcodigo' ,{oldcodigo: '@oldcodigo'});
    }

    function productSearch (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product_search');
    }
