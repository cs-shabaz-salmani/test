'use strict';

  const http = new XMLHttpRequest();
  var yumRepo = 'https://update.cybersponse.com/';
  var listItems = [];
  var filter = 'all';
  var listItemsBkp;

  function init() {
    var allItemsJson = $.getJSON({'url': "assets/info.json", 'async': false});
    allItemsJson = JSON.parse(allItemsJson.responseText);
    var totalItems = allItemsJson.length;
    listItems = allItemsJson;
    listItemsBkp = listItems;
    buildListData(listItems);
  }

  init();

  function applyFilter(event, type) {
    var filteredListItems = [];
    $("ul.sidebar-nav a").removeClass("active");
    $(event.target).addClass("active");
    listItems.forEach(function(item) {
      if(item.type === type) {
        filteredListItems.push(item); 
      }
    });
    
    buildListData(filteredListItems);
  }

  function openDetails(detail) {
    var detailPath;
    var downloadPath;
    var detailInfo;
    if(detail.type === 'connector'){
      detailPath = yumRepo + 'connectors/info/' + detail.name + '_' + detail.version + '/info.json';
      downloadPath = yumRepo + 'connectors/x86_64/' + detail.rpm_full_name;
    } else if(detail.type === 'widget') {
      detailPath = yumRepo + 'fsr-widgets/' + detail.name + '-' + detail.version + '/info.json';
      downloadPath = yumRepo + 'fsr-widgets/' + detail.name + '-' + detail.version + '/' + detail.name + '-' + detail.version + '.tgz';
    }

    $http.get(detailPath).then(function(response) {
      detailInfo = response.data;
      detailInfo.display = detail.display;
      detailInfo.type = detail.type;
      detailInfo.downloadPath = downloadPath;
    });
  };

  function submitSearch(searchText) {
    if(searchText.length >= 3) {
      var searchedListItems = [];
      listItems.forEach(function(item) {
        if(item.display.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          searchedListItems.push(item); 
        }
      });
      listItems = searchedListItems;
    } else {
      listItems = listItemsBkp;
    }
    
    buildListData(listItems);
  }

  function downloadFile(detail) {
    var downloadFileElement = document.createElement('a');
    downloadFileElement.href = detail.downloadPath;
    downloadFileElement.target = '_blank';
    downloadFileElement.download = detail.name + '-' + detail.version;
    document.body.appendChild(downloadFileElement);
    downloadFileElement.click();
    document.body.removeChild(downloadFileElement);
  }

  function buildListData(listData) {
    var allListItems;
    var marketPlace = $("#marketplace-list");
    listData.forEach(function(listItem) {
      var aTaglistItem = document.createElement('a');
      aTaglistItem.href = "#";
      aTaglistItem.className = "pull-left text-center item-container";
      var itemIconDiv = document.createElement('div');
      itemIconDiv.className = "item-icon";
      aTaglistItem.appendChild(itemIconDiv);
      var imageElement = document.createElement('img');
//       allListItems = "<div class='item-icon'>";
      if(listItem.type !== 'connector'){
        imageElement.src = "assets/images/icon_large.png";
//         allListItems += "<img src='assets/images/icon_large.png' />";
      } else {
        imageElement.src = listItem.iconLarge;
//         allListItems += "<img src=" +listItem.iconLarge + " />";
      }
      itemIconDiv.appendChild(imageElement);
      var itemTitle = document.createElement('h5');
      var itemDisplay = document.createTextNode(listItem.display);
      itemTitle.appendChild(itemDisplay);
      aTaglistItem.appendChild(itemTitle);
//       allListItems += "</div><h5>" + listItem.display + "</h5><div class='card-footer'><a class='card-link' href='#' title='GitHub Page' target='_blank'> <span class='fa fa-github'></span></a>";
//       allListItems += "<a class='card-link' href='#' title='Forks' target='_blank'><span class='fa fa-code-fork'></span>" + listItem.forks_count + "</a>";
//       allListItems += "<a class='card-link' href='#' title='Stargazers' target='_blank'><span class='fa fa-star'></span>" + listItem.stargazers_count + "</a></div>";
      
//       aTaglistItem.append($(allListItems).html());
      marketPlace.append(aTaglistItem);
    });
  }
