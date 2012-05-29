if(typeof localStorage.rules === 'undefined') {
  console.log('Initializing rules...');
  localStorage.rules = "[]";
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log('Received a message ' + (sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension"));
    if (request.type === "get_options") {
      sendResponse(localStorage.rules);
    }
  });

