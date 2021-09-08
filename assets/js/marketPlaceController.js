'use strict';

(function() {

  angular.module('fortinetMarketplace')
    .controller('marketplaceController', marketplaceController);
  
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
          angular.forEach(response, function(connector){
            connector.type = 'connector';
            connector.display = connector.label;
            connector.icon_large = yumRepo + 'connectors'+ value.path + value.name + '_' + value.version + '/images/' + value.icon;
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
              angular.forEach(data, function(widget){
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
