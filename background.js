var events;

if(typeof localStorage.rules === 'undefined' ||
   typeof localStorage.events === 'undefined') {
  console.log('Initializing data...');
  localStorage.rules = "[]";

  events = {
    // User remains on the page for a minimum time
    timeout: {
      time: 5000,
      handlers: []
    },
    // User doesn't move the mouse or scroll for a minimum time
    inactive: {
      time: 10000,
      handlers: []
    },
    // User has visited a set of pages for a given amount of time
    history: {
      handlers: []
    },
    // User scrolls below the fold
    scroll_distance: {
      handlers: []
    },
    // The window loses and regains focus
    regain_focus: {
      handlers: []
    }
  };
  localStorage.events = JSON.stringify(events);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log('Received a message ' + (sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension"));
    if (request.type === "getOptions") {
      sendResponse({
        rules: localStorage.rules,
        events: localStorage.events
      });
    } 
    else if(request.type === 'injectScripts') {
      console.log(sender.tab.id);
      chrome.tabs.executeScript(sender.tab.id, {file: "analytics.js"});
    }
});

// Listen for "clear history" button and forward message to content scripts
chrome.extension.onConnect.addListener(function(port) {
  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.type === "clearHistory") {
      port.postMessage({clearHistory: true});
    }
  });
});

