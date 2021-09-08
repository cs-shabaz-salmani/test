'use strict';

(function() {
  var app = angular.module('fortinetMarketplace', [
      'ui.bootstrap',
      'ui.bootstrap.contextMenu',
      'ui.bootstrap.datetimepicker',
      'ui.grid',
      'ui.grid.cellNav',
      'ui.grid.resizeColumns',
      'ui.grid.autoResize',
      'ui.grid.selection',
      'ui.grid.expandable',
      'ui.grid.exporter',
      'ui.grid.moveColumns',
      'ui.grid.pinning',
      'ui.router',
      'ui.router.state.events',
      'ncy-angular-breadcrumb',
      'ngSlimScroll',
      'ng-drag-scroll',
      'autoheight'
    ]);
    app.config(['$urlRouterProvider', '$rootScopeProvider', '$locationProvider', '$breadcrumbProvider', '$httpProvider', 'localStorageServiceProvider', '$animateProvider', '$qProvider', '$logProvider', 'uiSelectConfig', '$controllerProvider', '$uiRouterProvider',
      function($urlRouterProvider, $rootScopeProvider, $locationProvider, $breadcrumbProvider, $httpProvider, localStorageServiceProvider, $animateProvider, $qProvider, $logProvider, uiSelectConfig, $controllerProvider, $uiRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
        $uiRouterProvider.plugin(StickyStatesPlugin);
        $logProvider.debugEnabled(false);
        $rootScopeProvider.digestTtl(20);
        $qProvider.errorOnUnhandledRejections(false);
        if (window.localStorage.DEBUG) {
          $logProvider.debugEnabled(true);
          $qProvider.errorOnUnhandledRejections(true);
        }
        $breadcrumbProvider.setOptions({
          templateUrl: 'app/components/breadcrumb/breadcrumb.html'
        });
        $httpProvider.interceptors.push('AuthenticationInterceptor');
        $httpProvider.interceptors.push('PublishInterceptor');
        localStorageServiceProvider.setPrefix('cs');
        $animateProvider.classNameFilter(/toast|accordion/);
  
        uiSelectConfig.appendToBody = false;
        uiSelectConfig.closeOnSelect = false;
  
        app._controller = app.controller;
        app.controller = function(name, constructor) {
          $controllerProvider.register(name, constructor);
          return this;
        };
      }
    ]);
  })();