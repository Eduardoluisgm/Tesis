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

  function authUser ($auth,sessionControl, toastr,$location) {
    var cacheSession = function (cedula, userName) {
      sessionControl.set('userIsLogin',true);
      sessionControl.set('cedula',cedula);
      sessionControl.set('nombre',userName);
    };

    var uncacheSession = function () {
      sessionControl.unset('userIsLogin');
      sessionControl.unset('cedula');
      sessionControl.unset('nombre');
    };
    var login = function (credentials) {
      $auth.login(credentials).then(
        function (response) {
          cacheSession(response.data.user.cedula, response.data.user.name);
          toastr.info('Estoy logueado');
          $location.path('/');
          console.log('bn',response);

        }, function (err) {
          uncacheSession();
          toastr.error('Credenciales invalidas');
          console.log('erro',err);
        }
      );
    };
    return {
      loginApi: function (credentials) {
          login(credentials);
      },
      isLogin: function (){
        return sessionControl.get('userIsLogin') !==null;
      }
    }
  };
