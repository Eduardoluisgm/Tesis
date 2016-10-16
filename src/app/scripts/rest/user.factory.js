'use strict';

  angular.module('frontEndApp')
    .factory('user', user)
    .factory('userDeleted', userDeleted)
    .factory('userGet', userGet)
    .factory('userUpdate', userUpdate)
    .factory('profile',profile);

    function user ($resource, ApiUrl) {
      return $resource(ApiUrl+'/user');
    }
    function userDeleted ($resource, ApiUrl) {
      return $resource(ApiUrl+'/user/:cedula',{cedula: '@cedula'});
    }
    function userGet ($resource, ApiUrl) {
      return $resource(ApiUrl+'/user/:cedula',{cedula: '@cedula'});
    }
    function profile ($resource, ApiUrl) {
      return $resource(ApiUrl+'/profile');
    }
    function userUpdate (cachedResource, ApiUrl) {
      return cachedResource(ApiUrl+'/user/:oldcedula',{oldcedula: '@oldcedula'});
    }
