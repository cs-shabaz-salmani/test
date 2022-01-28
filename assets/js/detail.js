'use strict';

  const http = new XMLHttpRequest();
  var yumRepo = 'https://update.cybersponse.com/';

  init();

  function init() {
    var detailInfo;
    
    var info = window.localStorage.getItem('detailInfo');
    info = info.toString();
    var detailType = urlSearchParams.get('type');
    var detailName = urlSearchParams.get('entity');
    var detailVersion = urlSearchParams.get('version');
    var detailPath = yumRepo + 'detailInfo/infoPath/info.json';
    var mdFilepath = yumRepo + 'connectors/info/release_notes.md';

    httpGetAsync(detailPath, function(response) {
      detailInfo = response;
      detailInfo.display = detailInfo.label || detailInfo.title;
      detailInfo.type = detailType;
      var imgTag = document.createElement('img');
      imgTag.src = detailInfo.iconLarge || 'assets/images/icon_large.png';
      imgTag.alt = detailInfo.display;
      document.getElementById("detail-img-container").append(imgTag);
      document.getElementById("detail-heading").innerHTML = "About the " + detailInfo.display;
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
