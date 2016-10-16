'use strict';

  angular.module('frontEndApp')
    .factory('user', user)
    .factory('userDeleted', userDeleted)
    .factory('profile',profile);

    function user ($resource, ApiUrl) {
      return $resource(ApiUrl+'/user');
    }
    function userDeleted ($resource, ApiUrl) {
      return $resource(ApiUrl+'/user/:cedula',{cedula: '@cedula'});
    }
    function profile ($resource, ApiUrl) {
      return $resource(ApiUrl+'/profile');
    }
