'use strict';

  const http = new XMLHttpRequest();
  const urlSearchParams = new URLSearchParams(window.location.search);
  var yumRepo = 'https://update.cybersponse.com/';

  init();

  function init() {
    console.log('Details function called');
    var detailPath;
    var detailInfo;
    
    var detailType = urlSearchParams.get('type');
    var detailName = urlSearchParams.get('entity');
    var detailVersion = urlSearchParams.get('version');
    
    if(detailType === 'connector'){
      detailPath = yumRepo + 'connectors/info/' + detailName + '_' + detailVersion + '/info.json';
    } else if(detailType === 'widget') {
      detailPath = yumRepo + 'fsr-widgets/' + detailName + '-' + detailVersion + '/info.json';
    }

    httpGetAsync(detailPath, function(response) {
      detailInfo = response.data;
//       detailInfo.display = detail.display;
      detailInfo.type = detailType;
    });
  };

  function httpGetAsync(theUrl, callback){
    http.onreadystatechange = function() { 
        if (http.readyState == 4 && http.status == 200) {
          callback(http.responseText);
        }
    }
    http.open("GET", theUrl, true);
    http.send(null);
  };
