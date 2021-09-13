'use strict';

(function() {

  angular.module('fortinetMarketplace', ['ngRoute'])
    .controller('marketplaceController', marketplaceController)
    .config(config);
  
    function config ($routeProvider) {
      $routeProvider
      .when("/", {
        templateUrl : "assets/html/main.html"
      })
      .when("/detail", {
        templateUrl : "assets/html/detail.html"
      })
    };
    
    marketplaceController.$inject = ['$scope', '$http', '$location'];
    function marketplaceController ($scope, $http, $location) {
      
      $location.path('/');
      var yumRepo = 'https://update.cybersponse.com/';
      $scope.listItems = [];
      $scope.filter = 'all';
      var listItemsBkp;
      
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
            listItemsBkp = angular.copy($scope.listItems);
          });
          $http({
            method: 'GET',
            url: yumRepo + 'fsr-widgets/widgets.json',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          }).then(function (data) {
            angular.forEach(data.data, function(widget){
              widget.type = 'widget';
              widget.display = widget.title;
              $scope.listItems.push(widget);
              listItemsBkp = angular.copy($scope.listItems);
            }); 
          }, function (widgeterror) {
            console.log(widgeterror);
          });
      }, function (error) {
        console.log(error);
      }).finally(function () {
        listItemsBkp = angular.copy($scope.listItems);
      });
  
      $scope.applyFilter = function(type, event) {
        $scope.filter = type;
        $location.path('/');
        $("ul.sidebar-nav a").removeClass("active");
        $(event.target).addClass("active");
      };
      
      $scope.openDetails = function(detail) {
       $scope.detailInfo = detail;
       $location.path('/detail');
      };
      
      $scope.submitSearch = function (searchText) {
        if(searchText.length >= 3) {
          var filteredListItems = [];
          angular.forEach($scope.listItems, function(item) {
            if(item.display.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              filteredListItems.push(item); 
            }
          });
        } else {
          $scope.listItems = listItemsBkp;
        }
      };
        
      
    }
})();
