'use strict';

(function() {

  angular.module('fortinetMarketplace')
    .controller('marketplaceController', marketplaceController);
  
    marketplaceController.$inject = ['$scope', '$http'];
    function marketplaceController ($scope, $http) {
      console.log('test loaded');
      $http({
        method: 'GET',
        url: 'https://update.cybersponse.com/connectors/info/connectors.json',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        console.log(response);
      }, function (error) {
        console.log(error);
      });
    }
    
})();
