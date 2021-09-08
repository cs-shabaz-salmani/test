'use strict';

(function() {
  var app = angular.module('fortinetMarketplace', [
      'ui.router',
      'ui.router.state.events'
    ]);
    app.config(['$urlRouterProvider', '$rootScopeProvider', '$locationProvider', '$breadcrumbProvider', '$httpProvider', 'localStorageServiceProvider', '$animateProvider', '$qProvider', '$logProvider', 'uiSelectConfig', '$controllerProvider', '$uiRouterProvider',
      function($urlRouterProvider, $rootScopeProvider, $locationProvider, $breadcrumbProvider, $httpProvider, localStorageServiceProvider, $animateProvider, $qProvider, $logProvider, uiSelectConfig, $controllerProvider, $uiRouterProvider) {
        $urlRouterProvider.otherwise('/');
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
