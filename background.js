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
    if (request.type === "get_options") {
      sendResponse({
        rules: localStorage.rules,
        events: localStorage.events,
      });
    }
});

