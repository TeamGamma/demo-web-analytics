console.warn('loaded content script');

var rules = [];

// Load rules from background script
chrome.extension.sendRequest({type: "get_options"}, function(rules) {
  rules = JSON.parse(rules);
  console.log('Rules:');
  console.log(rules);
});


