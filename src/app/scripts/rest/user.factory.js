'use strict';

  angular.module('frontEndApp')
    .factory('user', user)
    .factory('profile',profile);

    function user ($resource, ApiUrl) {
      return $resource(ApiUrl+'/user');
    }
    function profile ($resource, ApiUrl) {
      return $resource(ApiUrl+'/profile');
    }
