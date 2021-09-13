'use strict';

(function() {

  angular.module('fortinetMarketplace')
    .controller('marketplaceController', marketplaceController)
    .config(config);
  
    config.$inject = ['ngRoute'];
    function config ($routeProvider) {
      $routeProvider
      .when("/", {
        templateUrl : "./html/main.html"
      })
      .when("/detail", {
        templateUrl : "./html/detail.html"
      })
    };
    
    marketplaceController.$inject = ['$scope', '$http'];
    function marketplaceController ($scope, $http) {
      
      console.log('test loaded');
      var yumRepo = 'https://update.cybersponse.com/';
      $scope.listItems = [];
      $scope.filter = 'all';
      $http({
        method: 'GET',
        url: yumRepo + 'connectors/info/connectors.json',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
          angular.forEach(response.data, function(connector){
            connector.type = 'connector';
            connector.display = connector.label;
            connector.iconLarge = yumRepo + 'connectors' + connector.path + connector.name + '_' + connector.version + '/images/' + connector.icon;
            $scope.listItems.push(connector);
          });
          $http({
            method: 'GET',
            url: yumRepo + 'fsr-widgets/widgets.json',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          }).then(function (data) {
            console.log(data);
              angular.forEach(data.data, function(widget){
                widget.type = 'widget';
                widget.display = widget.title;
                $scope.listItems.push(widget);
              }); 
          }, function (widgeterror) {
            console.log(widgeterror);
          });
      }, function (error) {
        console.log(error);
      });
  
      $scope.applyFilter = function(type) {
        $scope.filter = type;
      }
      
    }
})();
