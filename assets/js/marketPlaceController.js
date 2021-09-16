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
      
      var allItemsJson = $.getJSON({'url': "assets/info.json", 'async': false});
      allItemsJson = JSON.parse(allItemsJson.responseText);
      document.write(allItemsJson.a);
      $scope.totalItems = allItemsJson.length;
      $scope.listItems = allItemsJson;
      listItemsBkp = angular.copy($scope.listItems);
  
      $scope.applyFilter = function(type, event) {
        $scope.filter = type;
        $location.path('/');
        $("ul.sidebar-nav a").removeClass("active");
        $(event.target).addClass("active");
      };
      
      $scope.openDetails = function(detail) {
        $location.path('/detail');
        var detailPath;
        if(detail.type === 'connector'){
          detailPath = yumRepo + 'connectors/info/' + detail.name + '_' + detail.version + '/info.json';
        } else if(detail.type === 'widget') {
          detailPath = yumRepo + 'fsr-widgets/' + detail.name + '-' + detail.version + '/info.json';
        }
        
        $http.get(detailPath).then(function(response) {
          $scope.detailInfo = response.data;
          $scope.detailInfo.display = detail.display;
          $scope.detailInfo.type = detail.type;
        });
      };
      
      $scope.submitSearch = function (searchText) {
        if(searchText.length >= 3) {
          var filteredListItems = [];
          angular.forEach($scope.listItems, function(item) {
            if(item.display.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              filteredListItems.push(item); 
            }
          });
          $scope.listItems = filteredListItems;
        } else {
          $scope.listItems = listItemsBkp;
        }
      };
      
      $scope.downloadFile = function (detail) {
        var downloadFileElement = document.createElement('a');
        if(detail.type === 'connector'){
          downloadFileElement.href = yumRepo + 'connectors/x86_64/cyops-connector-' + detail.name + '-' + detail.version + '-' + 'el7.centos.x86_64.rpm';
        } else if(detail.type === 'widget') {
          downloadFileElement.href = yumRepo + 'fsr-widgets/' + detail.name + '-' + detail.version + '/' + detail.name + '-' + detail.version + '.tgz';
        }
        downloadFileElement.target = '_blank';
        downloadFileElement.download = detail.name + '-' + detail.version;
        document.body.appendChild(downloadFileElement);
        downloadFileElement.click();
        document.body.removeChild(downloadFileElement);
      }
        
      
    }
})();
