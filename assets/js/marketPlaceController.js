'use strict';

(function() {

  angular.module('fortinetMarketplace')
    .controller('marketplaceController', marketplaceController);
  
    marketplaceController.$inject = ['$scope', '$http'];
    function marketplaceController ($scope, $http) {
      
      console.log('test loaded');
      $scope.listItems = [];
      $scope.filter = 'all';
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
            connector.display = connector.label;
            $scope.listItems.push(connector);
          });
          $http({
            method: 'GET',
            url: 'https://update.cybersponse.com/fsr-widgets/widgets.json',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          }).then(function (data) {
            console.log(data);
            if(data.status === 200){
              angular.forEach(data.data, function(widget){
                widget.type = 'widget';
                widget.display = widget.title;
                $scope.listItems.push(widget);
              }); 
            }
          }, function (widgeterror) {
            console.log(widgeterror);
          });
        }
      }, function (error) {
        console.log(error);
      });
  
      $scope.applyFilter = function(type) {
        $scope.filter = type;
      }
      
    }
})();
