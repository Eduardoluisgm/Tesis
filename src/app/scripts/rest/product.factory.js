'use strict';

  angular.module('frontEndApp')
    .factory('productResource', productResource)
    .factory('product_Providers', product_Providers)
    .factory('productEdit', productEdit)
    .factory('product', product)
    .factory('productActive', productActive)
    .factory('productCategory', productCategory)
    .factory('productSearch', productSearch);

    function product_Providers (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/product/:codigo/provider' ,{codigo: '@codigo'});
    }

    function productCategory (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/category');
    }

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
