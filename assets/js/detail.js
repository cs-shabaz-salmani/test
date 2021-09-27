'use strict';

  const http = new XMLHttpRequest();
  const urlSearchParams = new URLSearchParams(window.location.search);
  var yumRepo = 'https://update.cybersponse.com/';

  init();

  function init() {
    var detailPath;
    var detailInfo;
    var mdFilepath;
    
    var detailType = urlSearchParams.get('type');
    var detailName = urlSearchParams.get('entity');
    var detailVersion = urlSearchParams.get('version');
    
    if(detailType === 'connector'){
      detailPath = yumRepo + 'connectors/info/' + detailName + '_' + detailVersion + '/info.json';
      mdFilepath = yumRepo + 'connectors/info/' + detailName + '_' + detailVersion + '/release_notes.md';
    } else if(detailType === 'widget') {
      detailPath = yumRepo + 'fsr-widgets/' + detailName + '-' + detailVersion + '/info.json';
    }

    httpGetAsync(detailPath, function(response) {
      detailInfo = response;
      detailInfo.display = detailInfo.label || detailInfo.title;
      detailInfo.type = detailType;
      var imgTag = document.createElement('img');
      imgTag.src = detailInfo.iconLarge || 'assets/images/icon_large.png';
      imgTag.alt = detailInfo.display;
      document.getElementById("detail-img-container").append(imgTag);
      document.getElementById("detail-heading").innerHTML = "About the " + detailInfo.display;
      document.getElementById("detail-title").innerHTML = detailInfo.display;
      document.getElementById("detail-version").innerHTML = detailVersion;
      document.getElementById("detail-certified").innerHTML = detailInfo.cs_approved ? 'Yes' : 'No';
      document.getElementById("detail-publisher").innerHTML = (detailInfo.publisher == 'Fortinet' || detailInfo.publisher == 'Cybersponse') ? 'Fortinet' : detailInfo.publisher;
      document.getElementById("detail-description").innerHTML = detailInfo.description;
      var mdContentTag = document.createElement('zero-md');
      mdContentTag.setAttribute("src", mdFilepath);
      document.getElementById("detail-release-notes").append(mdContentTag);
//       httpGetAsync(mdFilepath, function(fileResponse) {
//         document.getElementById("detail-release-notes").innerHTML = fileResponse;
//       });
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
