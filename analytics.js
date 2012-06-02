console.warn('analytics loaded');
var rules, events, options;

// Load options from background script
chrome.extension.sendRequest({type: "getOptions"}, function(data) {
  rules = JSON.parse(data.rules);
  events = JSON.parse(data.events);
  options = JSON.parse(data.options);

  init();
});

var init = function() {
  console.log(options);

  // History tracking
  var history;
  if('history' in localStorage) {
    history = JSON.parse(localStorage.history);
  } else {
    history = {};
  }

  var port = chrome.extension.connect();
  port.onMessage.addListener(function(data) {
    if(data.clearHistory) {
        console.warn('Clearing history for this page...');
        history = {};
        localStorage.history = JSON.stringify(history);
    }
  });

  var path = window.location.pathname;
  // Initialize counter for this page
  if(!(path in history) || history[path] === null) {
      history[path] = 0;
      localStorage.history = JSON.stringify(history);
  }
  // Update counter every 1s
  setInterval(function() {
      history[path] += 1000;
      localStorage.history = JSON.stringify(history);
  }, 1000);

};
