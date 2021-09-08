'use strict';

(function() {

  angular.module('fortinetMarketplace')
    .controller('marketplaceController', marketplaceController);

    marketplaceController.$inject = ['$scope', '$http'];

    function marketplaceController ($scope, $http) {
      console.log('test loaded');
    }
    
})();