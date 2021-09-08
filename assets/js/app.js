'use strict';

(function() {
  var app = angular.module('fortinetMarketplace', []);
    app.config(['$rootScopeProvider', '$locationProvider', '$httpProvider', '$qProvider', '$logProvider', '$controllerProvider',
      function($rootScopeProvider, $locationProvider, $httpProvider, $qProvider, $logProvider, $controllerProvider) {
        $locationProvider.html5Mode(true);
        $logProvider.debugEnabled(false);
        $rootScopeProvider.digestTtl(20);
        $qProvider.errorOnUnhandledRejections(false);
        if (window.localStorage.DEBUG) {
          $logProvider.debugEnabled(true);
          $qProvider.errorOnUnhandledRejections(true);
        }
  
        app._controller = app.controller;
        app.controller = function(name, constructor) {
          $controllerProvider.register(name, constructor);
          return this;
        };
      }
    ]);
  })();
