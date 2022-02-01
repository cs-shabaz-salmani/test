'use strict';

  const http = new XMLHttpRequest();
  var yumRepo = 'https://update.cybersponse.com';
  var basePath = 'http://marketplace.cybersponse.com/';

  init();

  function init() {
    var detailInfo;
    
    var allInfoPath = window.localStorage.getItem('detailInfoPath');
    allInfoPath = JSON.parse(allInfoPath);
    var detailType = urlSearchParams.get('type');
    var detailName = urlSearchParams.get('entity');
    var detailVersion = urlSearchParams.get('version');
    var infoPath = allInfoPath.find(function(item, index) {
      if(item.name === detailName && item.version === detailVersion){
        return true;
      }
    });
    infoPath = infoPath.infoPath;
    var detailPath = yumRepo + infoPath + '/info.json';
    var mdFilepath = yumRepo + infoPath + '/release_notes.md';

    httpGetAsync(detailPath, function(response) {
      detailInfo = response;
      detailInfo.display = detailInfo.label || detailInfo.title;
      detailInfo.type = detailType;
      var imageElement;
      if(detailInfo.iconLarge) {
        imageElement = document.createElement('img');
        imageElement.className = "mp-tile-image";
        imageElement.src = yumRepo + detailInfo.iconLarge;
        imageElement.alt = detailInfo.display;
      } else {
        imageElement = document.createElement('i');
        imageElement.className = "mp-tile-icon icon-" + detailInfo.type + "-large";
      }
      document.getElementById("dropdownVersionLink").innerHTML = "Version - " + detailInfo.version;
      var detailAvailableVersions = document.getElementById("detail-available-versions");
      detailInfo.availableVersions.forEach(function(version) {
        if(version !== detailInfo.version){
          var versionTag = document.createElement('a');
          versionTag.className = "dropdown-item";
          versionTag.href = basePath + "detail.html?entity=" + detailInfo.name + "&version=" + version + "&type=" + detailInfo.type;
          var versionText = document.createTextNode("Version - " + version);
          versionTag.append(versionText);
          detailAvailableVersions.append(versionTag);
        }
      });
      document.getElementById("detail-img-container").append(imageElement);
      document.getElementById("detail-heading").innerHTML = "About the " + detailInfo.display;
      document.getElementById("detail-version").innerHTML = detailVersion;
      document.getElementById("detail-certified").innerHTML = detailInfo.cs_approved ? 'Yes' : 'No';
      document.getElementById("detail-publisher").innerHTML = (detailInfo.publisher == 'Fortinet' || detailInfo.publisher == 'Cybersponse') ? 'Fortinet' : detailInfo.publisher;
      document.getElementById("detail-description").innerHTML = detailInfo.description;
      var releaseNotes = document.createElement('zero-md');
      releaseNotes.setAttribute("src", mdFilepath);
      document.getElementById("detail-release-notes").append(releaseNotes);
      var docLink = detailInfo.help;
      var docLinkBlock = document.getElementById("doc-content-block");
      if(docLink.match(/readme.md/gi)){
        docLink = docLink.replace("github.com", "raw.githubusercontent.com");
        docLink = docLink.replace("/blob", "");
        var docContent = document.createElement('zero-md');
        docContent.setAttribute("src", docLink);
        document.getElementById("detail-docs-content").append(docContent);
        docLinkBlock.classList.add("d-block");
        docLinkBlock.classList.remove("d-none");
      } else {
        var docLink = document.createElement('a');
        docLink.href = docLink;
        docLink.className = "nav-item detail-doc-link";
        docLink.setAttribute("title", "Online Help");
        docLink.setAttribute("target", "_blank");
        docLink.setAttribute("rel", "noopener noreferrer");
//         var docIcon = document.createElement('i');
//         docIcon.className = "fa fa-globe";
//         docLink.append(docIcon);
        var docLinkText = document.createTextNode("here");
        docLink.append(docLinkText);
        document.getElementById("detail-doc-link-here").append(docLink);
        docLinkBlock.classList.remove("d-block");
        docLinkBlock.classList.add("d-none");
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
