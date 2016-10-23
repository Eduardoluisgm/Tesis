(function() {
  'use strict';

  /*global FormData:false */
  /*global FileList:false */
  /*global File:false */

  angular
    .module('frontEndApp')
    .factory('cachedResource', cachedFactory);

  /** @ngInject */
  function cachedFactory($resource, $cacheFactory) {
    var cache = $cacheFactory('resourceCache');

    var interceptor = {
      response: function(response) {
        if ('config' in response && 'params' in response.config && response.config.params._refresh) {
          cache.removeAll();
        } else {
          cache.remove(response.config.url);
        }
        //$log.debug('cache removed', response.config.url);
        return response;
      }
    };

    var metadataInterceptor = {
      response: function(response) {
        response.resource.$metadata = response.data.$metadata;
        return response.resource;
      }
    };

    return resource;

    function instanceAll(arr, checkClass) {
      for (var i = 0; i < arr.length; ++i) {
        if (!(arr[i] instanceof checkClass)) {
          return false;
        }
      }

      return true;
    }

    function transformRequest(data) {
      if (angular.isUndefined(data)) {
        return data;
      }

      var fd = new FormData();
      angular.forEach(data, function(value, key) {
        if (value instanceof FileList) {
          if (value.length === 1) {
            fd.append(key, value[0]);
          } else {
            angular.forEach(value, function(file, index) {
              fd.append(key + '_' + index, file);
            });
          }
        } else if (value instanceof Array) {
          if (instanceAll(value, File)) {
            for (var i = 0; i < value.length; ++i) {
              fd.append(key + '[' + i + ']', value[i]);
            }
          }
        } else {
          fd.append(key, value);
        }
      });

      return fd;
    }

    function transformResponse(data) {
      var wrappedResult = angular.fromJson(data);
      //noinspection JSUnresolvedVariable
      wrappedResult.data.$metadata = wrappedResult.metadata;
      return wrappedResult.data;
    }

    function resource(url, paramDefaults, actions, options) {
      actions = angular.extend({}, actions, {
        'get': {
          method: 'GET',
          cache: cache
        },
        'getFresh': {
          method: 'GET'
        },
        'query': {
          method: 'GET',
          cache: cache,
          isArray: true
        },
        'queryFresh': {
          method: 'GET',
          isArray: true
        },
        'list': {
          method: 'GET',
          cache: cache,
          isArray: true,
          interceptor: metadataInterceptor,
          transformResponse: transformResponse
        },
        'listFresh': {
          method: 'GET',
          isArray: true,
          interceptor: metadataInterceptor,
          transformResponse: transformResponse
        },
        'save': {
          method: 'POST',
          interceptor: interceptor
        },
        'saveForm': {
          method: 'POST',
          transformRequest: transformRequest,
          interceptor: interceptor,
          headers: {
            'Content-Type': undefined
          }
        },
        'update': {
          method: 'PUT',
          interceptor: interceptor
        },
        'patch': {
          method: 'PATCH',
          interceptor: interceptor
        },
        'patchForm': {
          method: 'PATCH',
          transformRequest: transformRequest,
          interceptor: interceptor,
          headers: {
            'Content-Type': undefined
          }
        },
        'remove': {
          method: 'DELETE',
          interceptor: interceptor
        },
        'delete': {
          method: 'DELETE',
          interceptor: interceptor
        }
      });

      return $resource(url, paramDefaults, actions, options);
    }
  }
})();
