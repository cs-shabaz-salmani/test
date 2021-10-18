'use strict';

  const urlSearchParams = new URLSearchParams(window.location.search);

  var yumRepo = 'https://update.cybersponse.com/';
  var basePath = 'http://marketplace.cybersponse.com/';
  var listItems = [];
  var listItemsBkp;

  $(document).ready(function() {
    var navBar = $('#sidebar');
    if(navBar){
      navBar.load('assets/html/sidebar.html');
      setTimeout(function(){
        if (window.location.href.indexOf('connect.html') > -1) {
          $("#lets_connect_link").addClass("active");
        } else {
          $("#lets_connect_link").removeClass("active");
        }
      }, 1000);
    }
    var footer = $('#footer-container');
    if(footer){
      footer.load('assets/html/footer.html');
    }
  });

  function init() {
    var allItemsJson = $.getJSON({'url': "assets/info.json", 'async': false});
    allItemsJson = JSON.parse(allItemsJson.responseText);
    var totalItems = allItemsJson.length;
    listItems = allItemsJson;
    listItemsBkp = listItems;
    buildListData(listItems);
    var categoryType = urlSearchParams.get('category');
    if(categoryType){
      filterContent(categoryType);
      setTimeout(function(){
        $("#" + categoryType + "_filter_btn").addClass("active");
      }, 1000);
    }
  }

  if (window.location.href.indexOf('list.html') > -1) {
    init();
  }

  function loadCategoryList(type) {
    window.location.href = "/list.html?category=" + type;
  }

  function applyFilter(event, type) {
    if (window.location.href.indexOf('list.html') === -1) {
      window.location.href = "/list.html";
    }
    $(".sidebar-content .btn").removeClass("active");
    $("#" + type + "_filter_btn").addClass("active");
    filterContent(type);
  }

  function filterContent(type) {
    var filteredListItems = [];
    if(type !== 'all'){
      listItems.forEach(function(item) {
        if(item.type === type) {
          filteredListItems.push(item); 
        }
      });
    } else {
      filteredListItems = listItemsBkp;
    }
    buildListData(filteredListItems);
  }

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
    $(".item-container").remove();
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
