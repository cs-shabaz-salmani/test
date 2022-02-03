'use strict';

  const urlSearchParams = new URLSearchParams(window.location.search);
  var yumRepo = 'https://update.cybersponse.com/';
  var basePath = 'http://marketplace.cybersponse.com/';
  var listItems = [];
  var listItemsBkp;
  var paramCategoryType = urlSearchParams.get('contentType');
  var searchContent = urlSearchParams.get('searchContent');

  $(document).ready(function() {
    var navBar = $('#sidebar');
    if(navBar){
      navBar.load('assets/html/sidebar.html');
      setTimeout(function(){
        if (window.location.href.indexOf('connect.html') > -1) {
          $("#lets_connect_link").addClass("d-none");
        } else {
          $("#lets_connect_link").removeClass("d-none");
        }
        if(searchContent) {
          $("#searchText").val(searchContent);
        }
      }, 1000);
    }
    var footer = $('#footer-container');
    if(footer){
      footer.load('assets/html/footer.html');
    }
    $('.dropdown-toggle').dropdown();
    $('.nav-tabs').tab();
    buildHomePageBanners();
  });

  function init() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", yumRepo + "marketplace-test/marketplace.json", false ); // false for synchronous request
    xmlHttp.send( null );
    var allItemsJson = xmlHttp.responseText;
//     var allItemsJson = $.getJSON({'url': "info/marketplace.json", 'async': false});
    allItemsJson = JSON.parse(allItemsJson);
    var updatesList = [];
    _.each(allItemsJson, function(item, index) {
      if(index === 0 || index === 100 || index === 150 || index === 200 || index === 250 || index === 300 || index === 350 || index === 400){
         updatesList.push(item); 
      }
    });
    buildUpdatesAvailableList(updatesList);
    
    var totalItems = allItemsJson.length;
    listItems = allItemsJson;
    listItemsBkp = listItems;
    if(paramCategoryType && !searchContent){
      filterContent(paramCategoryType);
      setTimeout(function(){
          filterContent(paramCategoryType);
          $("#" + paramCategoryType + "_filter_btn").addClass("active");
          $("#" + paramCategoryType + "_sidebar_link").addClass("active");
      }, 1000);
    } else if (window.location.href.indexOf('list.html') > -1 && searchContent) {
      searchContentData(searchContent);
    } else {
      filterContent('all', true);
    }
    $("#totalContentCount").html(totalItems);
  }

  var initLoad = window.location.href.indexOf('connect.html') > -1 || window.location.href.indexOf('detail.html') > -1;

  if (!initLoad) {
    init();
  }

  function applyFilter(item, type, filterType) {
    var contentType = urlSearchParams.get('contentType') || [];
    console.log(item);
    var contentTypeParams;
    if(item.checked) {
      if(filterType === 'contentType'){
        contentTypeParams = updateFilterParams(contentType, type, 'add');
      }
    } else {
      if(filterType === 'contentType'){
        contentTypeParams = updateFilterParams(contentType, type, 'remove');
      }
    }
    if (window.location.href.indexOf('list.html') === -1) {
      window.location.href = "/list.html?contentType=" + contentTypeParams;
    } else {
      window.history.replaceState(null, null, "/list.html?contentType=" + contentTypeParams);
    }
    $(".sidebar-content .btn").removeClass("active");
    $("ul.btnGroupCategory .sidebar-item a").removeClass("active");
    $("#" + type + "_filter_btn").addClass("active");
    $("#" + type + "_sidebar_link").addClass("active");
    filterContent(contentType);
  }

  function updateFilterParams(data, item, method) {
    if(method === 'add') {
      data.push(item);
    } else {
      var index = data.indexOf(item);
      if (index > -1) {
        data.splice(index, 1);
      }
    }
    return data;
    
  }

  function filterContent(types, latest) {
    var filteredListItems = [];
    if(types){
      _.each(listItems, function(item) {
        _.each(types, function(type) {
          if(item.type === type) {
            filteredListItems.push(item); 
          }
        });
      });
    } else if(latest) {
      var todaysDate = new Date();
      todaysDate = todaysDate.getTime();
      
      _.each(listItems, function(item, index) {
        var timeStampToDate = new Date(item.published_date);
        var time_difference = todaysDate - (item.published_date * 1000);
        time_difference = time_difference / (1000 * 60 * 60 * 24);
        if(time_difference > 0 && time_difference <= 15){
          filteredListItems.push(item); 
        }
      });
    } else {
      filteredListItems = listItemsBkp;
    }
    buildListData(filteredListItems);
  }

  function submitSearch() {
    var searchText = $("#searchText").val();
    if(searchText.length >= 3 || searchText.length === 0) {
      var searchParams = searchText.length >= 3 ? "&searchContent=" + searchText : "";
      if (window.location.href.indexOf('list.html') === -1) {
        window.location.href = "/list.html?contentType=all" + searchParams;
      } else {
        window.history.replaceState(null, null, "/list.html?category=all" + searchParams);
      }
    } else {
      console.log('Enter atleast 3 chars');
    }
  }

  function searchContentData(match) {
    var searchedListItems = [];
    _.each(listItems, function(item) {
      if(paramCategoryType && paramCategoryType !== 'all'){
        if(paramCategoryType === item.type && item.name.toLowerCase().indexOf(match.toLowerCase()) > -1) {
          searchedListItems.push(item);
        }
      } else {
        if(item.name.toLowerCase().indexOf(match.toLowerCase()) > -1) {
           searchedListItems.push(item);
        }
      }
    });
    
    buildListData(searchedListItems);
  }

  function buildHomePageBanners() {
    var mainBanner = $("#main-carousel-content");
    var mainBannerIndicator = $("#main-carousel-indicators");
    var bannersJson = $.getJSON({'url': "assets/banners.json", 'async': false});
    bannersJson = JSON.parse(bannersJson.responseText);
    _.each(bannersJson.mainBanner, function(banner, index) {
      var carouselId = "carouselMainCaptions" + index;
      var carouselIndicatorButton = document.createElement('button');
      carouselIndicatorButton.className = index === 0 ? "active" : "";
      carouselIndicatorButton.setAttribute("type", "button");
      carouselIndicatorButton.setAttribute("data-bs-target", carouselId);
      carouselIndicatorButton.setAttribute("data-bs-slide-to", index);
      carouselIndicatorButton.setAttribute("aria-label", banner.heading);
    
      mainBannerIndicator.append(carouselIndicatorButton);
      
      var carouselDiv = document.createElement('div');
      carouselDiv.className = index === 0 ? "carousel-item active custom-left-offset-1 custom-right-offset-1" : "carousel-item custom-left-offset-1 custom-right-offset-1";
      
      var carouselRow = document.createElement('div');
      carouselRow.className = "row";
      carouselRow.setAttribute("id", carouselId);
      carouselDiv.appendChild(carouselRow);
      
      var carouselColumn = document.createElement('div');
      carouselColumn.className = "col-md-12";
      carouselRow.appendChild(carouselColumn);
      
      var carouselHeading = document.createElement('h1');
      carouselColumn.appendChild(carouselHeading);
      
      var carouselHeadingText = document.createTextNode(banner.heading);
      carouselHeading.appendChild(carouselHeadingText);
      
      var carouselSubHeading = document.createElement('p');
      carouselColumn.appendChild(carouselSubHeading);
      
      var carouselSubHeadingText = document.createTextNode(banner.subHeading);
      carouselSubHeading.appendChild(carouselSubHeadingText);
      
      var carouselHyperLink = document.createElement('a');
      carouselHyperLink.href = banner.hyperLink;
      carouselHyperLink.className = "pull-left text-center btn btn-md btn-outline-dark";
      carouselHyperLink.setAttribute("rel", "canonical");
      var carouselHyperLinkText = document.createTextNode("View");
      carouselHyperLink.appendChild(carouselHyperLinkText);
      carouselColumn.appendChild(carouselHyperLink);
      
      mainBanner.append(carouselDiv);
    });
  }

  function buildUpdatesAvailableList(listData){
   var marketPlaceUpdates = $("#latest-hub-updates");
   _.each(listData, function(listItem) {
      var listItemCard = document.createElement('div');
      listItemCard.className = "col-md-3";
      var listItemCardContent = document.createElement('div');
      listItemCardContent.className = "mp-update-tile-container";
      listItemCard.append(listItemCardContent);
      var aTaglistItem = document.createElement('a');
      aTaglistItem.className = "text-decoration-none";
      aTaglistItem.href = basePath + "detail.html?entity=" + listItem.name + "&version=" + listItem.version + "&type=" + listItem.type;

      var itemType = document.createElement('p');
      itemType.className = "mp-content-type";
      var itemTypeText = document.createTextNode(listItem.type === 'solutionpack' ? 'Solution Pack' : listItem.type);
      itemType.appendChild(itemTypeText);
      aTaglistItem.appendChild(itemType);
     
      var itemIconDiv = document.createElement('div');
      itemIconDiv.className = "mp-tile-image-container";

      var imageElement = document.createElement('i');
      imageElement.className = "mp-tile-icon icon-" + listItem.type + "-type";
      itemIconDiv.appendChild(imageElement);
      aTaglistItem.appendChild(itemIconDiv);

      var itemContentDiv = document.createElement('div');
      itemContentDiv.className = "mp-content-fixed-height";

      var itemTitle = document.createElement('h4');
      itemTitle.className = "mp-tile-title";
      var itemTitleText = document.createTextNode(listItem.label || listItem.display);
      itemTitle.appendChild(itemTitleText);
      itemContentDiv.appendChild(itemTitle);

      var itemDetailsDiv = document.createElement('div');
      itemDetailsDiv.className = "mp-tile-details";

      var itemPublisher = document.createElement('p');
      itemPublisher.className = "m-0";
      var itemPublisherTag = document.createElement('span');
      itemPublisherTag.className = "muted";
      var itemPublisherTagText = document.createTextNode("Published By:");
      itemPublisherTag.appendChild(itemPublisherTagText);
      itemPublisher.appendChild(itemPublisherTag);
      var itemPublisherText = document.createTextNode(listItem.publisher);
      itemPublisher.appendChild(itemPublisherText);
      itemDetailsDiv.appendChild(itemPublisher);
      itemContentDiv.appendChild(itemDetailsDiv);
      aTaglistItem.appendChild(itemContentDiv);
      var itemButton = document.createElement('button');
      itemButton.className = "btn p-0 btn-link";
      var itemButtonText = document.createTextNode("Learn More");
      itemButton.appendChild(itemButtonText);
      aTaglistItem.appendChild(itemButton);
      listItemCardContent.append(aTaglistItem);

      marketPlaceUpdates.append(listItemCard);
    }); 
  }


  function buildListData(listData) {
    var allListItems;
    var marketPlace = $("#marketplace-list");
    $(".item-container").remove();
    $("#filteredContentCount").html(listData.length);
    _.each(listData, function(listItem) {
      var aTaglistItem = document.createElement('a');
      aTaglistItem.href = basePath + "detail.html?entity=" + listItem.name + "&version=" + listItem.version + "&type=" + listItem.type;
      aTaglistItem.className = "mp-tile-container";
      
      var itemIconSpan = document.createElement('span');
      itemIconSpan.className = "mp-content-type-icon pull-left";
      var itemIcon = document.createElement('i');
      itemIcon.className = "icon-" + listItem.type + "-type icon";
      itemIconSpan.appendChild(itemIcon);
      aTaglistItem.appendChild(itemIconSpan);
      
      var itemType = document.createElement('p');
      itemType.className = "mp-content-type d-inline-block";
      var itemTypeText = document.createTextNode(listItem.type === 'solutionpack' ? 'Solution Pack' : listItem.type);
      itemType.appendChild(itemTypeText);
      aTaglistItem.appendChild(itemType);
      
      var itemContentDiv = document.createElement('div');
      itemContentDiv.className = "mp-content-fixed-height";
      
      var itemTitle = document.createElement('h4');
      itemTitle.className = "mp-tile-title";
      var itemTitleText = document.createTextNode(listItem.label || listItem.display);
      itemTitle.appendChild(itemTitleText);
      itemContentDiv.appendChild(itemTitle);
      
      var itemDetailsDiv = document.createElement('div');
      itemDetailsDiv.className = "mp-tile-details";

      var itemVersion = document.createElement('p');
      itemVersion.className = "m-0";
      var itemVersionTag = document.createElement('span');
      itemVersionTag.className = "text-black-50";
      var itemVersionTagText = document.createTextNode("Version: ");
      itemVersionTag.appendChild(itemVersionTagText);
      itemVersion.appendChild(itemVersionTag);
      var itemVersionText = document.createTextNode(listItem.version);
      itemVersion.appendChild(itemVersionText);
      itemDetailsDiv.appendChild(itemVersion);
      
      var itemPublisher = document.createElement('p');
      itemPublisher.className = "m-0";
      var itemPublisherTag = document.createElement('span');
      itemPublisherTag.className = "text-black-50";
      var itemPublisherTagText = document.createTextNode("Published By: ");
      itemPublisherTag.appendChild(itemPublisherTagText);
      itemPublisher.appendChild(itemPublisherTag);
      var itemPublisherText = document.createTextNode(listItem.publisher);
      itemPublisher.appendChild(itemPublisherText);
      itemDetailsDiv.appendChild(itemPublisher);
      itemContentDiv.appendChild(itemDetailsDiv);
      aTaglistItem.appendChild(itemContentDiv);
      
      var itemIconDiv = document.createElement('div');
      itemIconDiv.className = "mp-tile-image-container";
      
      var imageElement;
      if(listItem.iconLarge) {
        imageElement = document.createElement('img');
        imageElement.className = "mp-tile-image";
        imageElement.src = yumRepo + listItem.iconLarge;
      } else {
        imageElement = document.createElement('i');
        imageElement.className = "mp-tile-icon icon-" + listItem.type + "-large";
      }
      
      itemIconDiv.appendChild(imageElement);
      aTaglistItem.appendChild(itemIconDiv);
      
      var cardDescription = document.createElement('p');
      cardDescription.className = "card-description mp-tile-description muted-80"; //remove card-description class
      listItem.description = listItem.description ? listItem.description : 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...';
      var itemDescription = document.createTextNode(listItem.description.substring(0, 90) + '...');
      cardDescription.appendChild(itemDescription);
      aTaglistItem.appendChild(cardDescription);
      marketPlace.append(aTaglistItem);
    });
  }

