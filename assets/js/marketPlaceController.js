'use strict';

(function() {

  angular.module('fortinetMarketplace')
    .controller('marketplaceController', marketplaceController);
  
    marketplaceController.$inject = ['$scope', '$http'];
    function marketplaceController ($scope, $http) {
      console.log('test loaded');
      $scope.listItems = [];
      $http({
        method: 'GET',
        url: 'https://update.cybersponse.com/connectors/info/connectors.json',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        if(response.status === 200){
          angular.forEach(response.data, function(connector){
            connector.type = 'connector';
            $scope.listItems.push(connector);
          });
          $http({
            method: 'GET',
            url: 'https://update.cybersponse.com/fsr-widgets/widgets.json',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          }).then(function (response) {
            console.log(response);
            if(response.status === 200){
              angular.forEach(response.data, function(widget){
                widget.type = 'widget';
                $scope.listItems.push(widget);
              }); 
            }
          }, function (error) {
            console.log(error);
          });
        }
      }, function (error) {
        console.log(error);
      });
    }
    
})();
