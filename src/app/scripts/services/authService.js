'use strict';

angular.module('authService',[])
  .factory('sessionControl',sessionControl)
  .factory('authUser',authUser);

  /*Controla la sessiones del usuario*/
  function sessionControl () {
    return {
      get: function (key) {
        return sessionStorage.getItem(key);
      },
      set: function (key,val) {
        sessionStorage.setItem(key,val);
      },
      unset: function (key) {
        sessionStorage.removeItem(key);
      }
    }
  };

  function authUser ($auth,sessionControl, toastr,$location, $rootScope) {
    var cacheSession = function (cedula, userName, profile) {
      sessionControl.set('userIsLogin',true);
      sessionControl.set('cedula',cedula);
      sessionControl.set('nombre',userName);
      sessionControl.set('profile',profile);
    };

    var uncacheSession = function () {
      sessionControl.unset('userIsLogin');
      sessionControl.unset('cedula');
      sessionControl.unset('nombre');
      sessionControl.unset('profile');
    };
    var login = function (credentials) {
      $auth.login(credentials).then(
        function (response) {
          cacheSession(response.data.user.cedula, response.data.user.name, response.data.user);
          toastr.info('Bienvenido');
          $rootScope.$broadcast('MenuProfile');
          $location.path('/');

        }, function (err) {
          uncacheSession();
          toastr.error('Usuario no registrado');
          $rootScope.$broadcast('errorLogin');
        }
      );
    };
    return {
      loginApi: function (credentials) {
          login(credentials);
      },
      isLogin: function (){
        return sessionControl.get('userIsLogin') !==null;
      },
      profile: function () {
        return sessionControl.get('nombre');
      }
    }
  };
