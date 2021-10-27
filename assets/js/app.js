'use strict';

  const urlSearchParams = new URLSearchParams(window.location.search);

  var yumRepo = 'https://update.cybersponse.com/';
  var basePath = 'http://marketplace.cybersponse.com/';
  var listItems = [];
  var listItemsBkp;
  var paramCategoryType = urlSearchParams.get('category');

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
      }, 1000);
    }
    var footer = $('#footer-container');
    if(footer){
      footer.load('assets/html/footer.html');
    }
    $('.dropdown-toggle').dropdown();
    $('.nav-tabs').tab();
  });

  function init() {
    var allItemsJson = $.getJSON({'url': "info/marketplace.json", 'async': false});
    allItemsJson = JSON.parse(allItemsJson.responseText);
    var totalItems = allItemsJson.length;
    listItems = allItemsJson;
    listItemsBkp = listItems;
    if(paramCategoryType){
      filterContent(paramCategoryType);
      setTimeout(function(){
          filterContent(paramCategoryType);
          $("#" + paramCategoryType + "_filter_btn").addClass("active");
          $("#" + paramCategoryType + "_sidebar_link").addClass("active");
        $("#totalContentCount").html(totalItems);
      }, 1000);
    } else {
      filterContent('all', true);
    }
  }

  var initLoad = window.location.href.indexOf('connect.html') > -1 || window.location.href.indexOf('detail.html') > -1;

  if (!initLoad) {
    init();
  }

  function applyFilter(type) {
    window.history.replaceState(null, null, "?category=" + type);
    $(".sidebar-content .btn").removeClass("active");
    $("ul.btnGroupCategory .sidebar-item a").removeClass("active");
    $("#" + type + "_filter_btn").addClass("active");
    $("#" + type + "_sidebar_link").addClass("active");
    filterContent(type);
  }

  function filterContent(type, latest) {
    var filteredListItems = [];
    if(type !== 'all'){
      listItems.forEach(function(item) {
        if(item.type === type) {
          filteredListItems.push(item); 
        }
      });
    } else if(latest){
      var todaysDate = new Date();
      todaysDate = todaysDate.getTime();
      
      listItems.forEach(function(item) {
        var timeStampToDate = new Date(item.published_date);
        var time_difference = (item.published_date * 1000) - todaysDate;
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

  function submitSearch(event) {
    console.log(event);
    var searchText = $("#searchText").val();
    if(searchText.length >= 3) {
      var searchedListItems = [];
      listItems.forEach(function(item) {
        if(paramCategoryType && paramCategoryType !== 'all'){
          if(paramCategoryType === item.type && item.display.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
            searchedListItems.push(item);
          }
        } else {
          if(item.display.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
             searchedListItems.push(item);
          }
        }
      });
      listItems = searchedListItems;
    } else {
      listItems = listItemsBkp;
    }
    
    buildListData(listItems);
  }


  function buildListData(listData) {
    var allListItems;
    var marketPlace = $("#marketplace-list");
    $(".item-container").remove();
    $("#filteredContentCount").html(listData.length);
    listData.forEach(function(listItem) {
      var aTaglistItem = document.createElement('a');
      aTaglistItem.href = basePath + "detail.html?entity=" + listItem.name + "&version=" + listItem.version + "&type=" + listItem.type;
      aTaglistItem.className = "pull-left text-center item-container";
      aTaglistItem.setAttribute("rel", "canonical");
      
      var certifiedDiv = document.createElement('div');
      certifiedDiv.className = "certified-flag";
      var certifiedIcon = document.createElement('i');
      certifiedIcon.className = "fa fa-check-circle-o certified-icon";
      aTaglistItem.appendChild(certifiedDiv);
      aTaglistItem.appendChild(certifiedIcon);
      
      var itemIconDiv = document.createElement('div');
      itemIconDiv.className = "item-icon";
      aTaglistItem.appendChild(itemIconDiv);
      
      var imageElement = document.createElement('img');
      if(listItem.type !== 'connector'){
        imageElement.src = "assets/images/icon_large.png";
      } else {
        imageElement.src = listItem.iconLarge;
      }
      imageElement.width = "75";
      itemIconDiv.appendChild(imageElement);
      var itemTitle = document.createElement('h5');
      var itemDisplay = document.createTextNode(listItem.display);
      itemTitle.appendChild(itemDisplay);
      aTaglistItem.appendChild(itemTitle);
      
      var cardDescription = document.createElement('div');
      cardDescription.className = "card-description";
      listItem.description = listItem.description ? listItem.description : 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...';
      var itemDescription = document.createTextNode(listItem.description.substring(0, 90) + '...');
      cardDescription.appendChild(itemDescription);
      aTaglistItem.appendChild(cardDescription);
      
      var cardFooter = document.createElement('div');
      cardFooter.className = "card-footer";
      
      var aTagGitHubPage = document.createElement('a');
      aTagGitHubPage.href = "#";
      aTagGitHubPage.className = "card-link";
      aTagGitHubPage.title = "GitHub Page";
      aTagGitHubPage.target = "_blank";
      var gitHubIcon = document.createElement('span');
      gitHubIcon.className = "fa fa-github";
      aTagGitHubPage.appendChild(gitHubIcon);
      cardFooter.appendChild(aTagGitHubPage);
      
      var aTagGitForks = document.createElement('a');
      aTagGitForks.href = "#";
      aTagGitForks.className = "card-link";
      aTagGitForks.title = "Forks";
      aTagGitForks.target = "_blank";
      var gitHubForksIcon = document.createElement('span');
      gitHubForksIcon.className = "fa fa-code-fork";
      aTagGitForks.appendChild(gitHubForksIcon);
      var forksCount = document.createTextNode(listItem.forks_count);
      aTagGitForks.appendChild(forksCount);
      cardFooter.appendChild(aTagGitForks);
      
      var aTagGitStargazers = document.createElement('a');
      aTagGitStargazers.href = "#";
      aTagGitStargazers.className = "card-link";
      aTagGitStargazers.title = "Stargazers";
      aTagGitStargazers.target = "_blank";
      var gitHubStargazersIcon = document.createElement('span');
      gitHubStargazersIcon.className = "fa fa-star";
      aTagGitStargazers.appendChild(gitHubStargazersIcon);
      var stargazersCount = document.createTextNode(listItem.stargazers_count);
      aTagGitStargazers.appendChild(stargazersCount);
      cardFooter.appendChild(aTagGitStargazers);
      
      var aTagDocLink = document.createElement('a');
      aTagDocLink.href = "#";
      aTagDocLink.className = "card-link";
      aTagDocLink.title = "Documentation";
      aTagDocLink.target = "_blank";
      var docLinkIcon = document.createElement('span');
      docLinkIcon.className = "fa fa-globe";
      aTagDocLink.appendChild(docLinkIcon);
      cardFooter.appendChild(aTagDocLink);
      
      aTaglistItem.appendChild(cardFooter);
      marketPlace.append(aTaglistItem);
    });
  }
