'use strict';

  const http = new XMLHttpRequest();
  var yumRepo = 'https://repo.fortisoar.fortinet.com';
  var basePath = 'http://marketplace.cybersponse.com/';

  init();

  function init() {
    var detailInfo;
    var detailType = getUrlParameter('type');
    var detailName = getUrlParameter('entity');
    var detailVersion = getUrlParameter('version');
    var detailBuildNumber = getUrlParameter('buildNumber');
    detailBuildNumber = detailBuildNumber ? detailBuildNumber : 'latest';
    var infoPath = "/content-hub/" + detailName + "-" + detailVersion + "/" + detailBuildNumber;
    var detailPath = yumRepo + infoPath + '/info.json';
    var mdFilepath = yumRepo + infoPath + '/release_notes.md';

    httpGetAsync(detailPath, function(response) {
      detailInfo = response;
      detailInfo.display = detailInfo.label || detailInfo.title;
      detailInfo.type = detailType;
      var imageElement;
      if(detailInfo.iconLarge) {
        imageElement = document.createElement('img');
        imageElement.className = "mp-tile-image border-0";
        imageElement.src = yumRepo + detailInfo.iconLarge;
        imageElement.alt = detailInfo.display;
      } else {
        imageElement = document.createElement('i');
        imageElement.className = "mp-tile-icon icon-" + detailInfo.type + "-large m-3";
      }
      document.getElementById("detail-current-breadcrumb").innerHTML = detailInfo.display;
      document.getElementById("dropdownVersionLink").innerHTML = "Version - " + detailInfo.version;
      var detailAvailableVersions = document.getElementById("detail-available-versions");
      var dropdownVersionLink = document.getElementById("dropdownVersionLink");
      if(detailInfo.availableVersions.length > 0){
        detailAvailableVersions.classList.remove("d-none");
        _.each(detailInfo.availableVersions, function(version) {
          var versionTag = document.createElement('li');
          versionTag.className = version !== detailInfo.version ? "dropdown-item" : "dropdown-item";
          if(version !== detailInfo.version) {
//             versionTag.onclick = getBuildNumber(detailInfo.name, version, detailInfo.type);
//             versionTag.addEventListener("click", function () {
//               getBuildNumber(detailInfo.name, version, detailInfo.type);
//             });
          } else {
//             versionTag.href = basePath + "detail.html?entity=" + detailInfo.name + "&version=" + version + "&type=" + detailInfo.type + "&buildNumber=" + detailInfo.buildNumber;
//             versionTag.setAttribute("target", "_self");
          }
          var versionText = document.createTextNode("Version - " + version);
          versionTag.append(versionText);
          detailAvailableVersions.append(versionTag);
        });
      } else {
        dropdownVersionLink.classList.remove("dropdown-toggle");
        detailAvailableVersions.classList.add("d-none");
      }
      document.getElementById("detail-img-container").append(imageElement);
      document.getElementById("detail-heading").innerHTML = detailInfo.display;
      document.getElementById("detail-version").innerHTML = detailVersion;
      document.getElementById("detail-certified").innerHTML = detailInfo.cs_approved ? 'Yes' : 'No';
      document.getElementById("detail-publisher").innerHTML = (detailInfo.publisher == 'Fortinet' || detailInfo.publisher == 'Cybersponse') ? 'Fortinet' : detailInfo.publisher;
      document.getElementById("detail-description").innerHTML = detailInfo.description;


      if(detailInfo.releaseNotes === 'available'){
        var releaseNotes = document.createElement('zero-md');
        releaseNotes.setAttribute("src", mdFilepath);
        document.getElementById("detail-release-notes").append(releaseNotes);
      }
      if(detailInfo.type === "connector") {
        document.getElementById("release-notes-block").classList.remove("d-none");
      }
      var docLink = detailInfo.help;
      var docLinkBlock = document.getElementById("doc-content-block");
      var widgetLink = detailInfo.label.replace(/\s+/g, '');
      widgetLink = widgetLink + '.md';
      widgetLink = '\\b' + widgetLink + '\\b';
      if(docLink.match(/readme.md/gi) || docLink.match(new RegExp(widgetLink,'gi'))){
        docLink = docLink.replace("github.com", "raw.githubusercontent.com");
        docLink = docLink.replace("/blob", "");
        var docContent = document.createElement('zero-md');
        docContent.setAttribute("src", docLink);
        var docTemplate = document.createElement('template');
        docTemplate.setAttribute("data-merge", "append");
        docContent.append(docTemplate);
        var docBase = document.createElement('base');
        docBase.setAttribute("href", docLink);
        docTemplate.append(docBase);
        document.getElementById("detail-docs-content").append(docContent);
        $('.item-github-content').removeClass('d-none');
        docLinkBlock.classList.add("d-block");
        docLinkBlock.classList.remove("d-none");
      } else if(docLink) {
        var docLinkTag = document.createElement('a');
        docLinkTag.href = docLink;
        docLinkTag.className = "nav-item detail-doc-link";
        docLinkTag.setAttribute("title", "Online Help");
        docLinkTag.setAttribute("target", "_blank");
        docLinkTag.setAttribute("rel", "noopener noreferrer");
        var docLinkText = document.createTextNode("here");
        docLinkTag.append(docLinkText);
        document.getElementById("detail-doc-link-here").append(docLinkTag);
        document.getElementById("detail-doc-link").classList.remove("d-none");
        docLinkBlock.classList.remove("d-block");
        docLinkBlock.classList.add("d-none");
      }
      
      var githubLinkDiv = document.getElementById("detail-github-link");
      if(detailInfo.scm.type === 'public'){
        var githubLink = document.createElement('a');
        githubLink.href = detailInfo.scm.url;
        githubLink.className = "detail-github-link fs-4 text-black text-decoration-none";
        githubLink.setAttribute("title", "Github Repo");
        githubLink.setAttribute("target", "_blank");
        githubLink.setAttribute("rel", "noopener noreferrer");
        var githubLinkIcon = document.createElement("i");
        githubLinkIcon.className = "icon-github";
        githubLink.append(githubLinkIcon);
        githubLinkDiv.append(githubLink);
        githubLinkDiv.classList.add("d-block");
        githubLinkDiv.classList.remove("d-none");
      } else {
        githubLinkDiv.classList.remove("d-block");
        githubLinkDiv.classList.add("d-none");
      }
      var tagsContainer = document.getElementById("detail-tags-container");
      var tagsDiv = document.getElementById("detail-tags");
      if(detailInfo.tags && detailInfo.tags.length > 0){
        tagsContainer.classList.add("d-block");
        tagsContainer.classList.remove("d-none");
        _.each(detailInfo.tags, function(tag){
          var tagCard = document.createElement('span');
          tagCard.className = "detail-tag-card";
          var tagText = document.createTextNode(tag);
          tagCard.append(tagText);
          tagsDiv.append(tagCard);
        });
      } else {
        tagsContainer.classList.remove("d-block");
        tagsContainer.classList.add("d-none");
      }
    });
  };

  function httpGetAsync(theUrl, callback){
    http.onreadystatechange = function() { 
        if (http.readyState == 4 && http.status == 200) {
          callback(JSON.parse(http.responseText));
        }
    }
    http.open("GET", theUrl, true);
    http.send(null);
  };

  function getBuildNumber(contentName, contentVersion, contentType){
    var buildPath = yumRepo + "/content-hub/" + contentName + "-" + contentVersion + "/build.json";
    httpGetAsync(buildPath, function(response){
      var buildNumber = response.buildNumber;
      window.location.href = basePath + "detail.html?entity=" + contentName + "&version=" + contentVersion + "&type=" + contentType + "&buildNumber=" + buildNumber;
    });
  }

  function navigateToContent(){
    if (window.history.go(-1).indexOf('list.html') > -1) {
      window.history.go(-1);
    } else {
      window.location.href = "/list.html?contentType=all";
    }
  }
