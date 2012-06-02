console.warn('loaded content script');

// Ask background script to load scripts.js
chrome.extension.sendRequest({type: "injectScripts"});

/*
var rules = [];
var events = {};

// Load rules from background script
chrome.extension.sendRequest({type: "getOptions"}, function(data) {
  rules = JSON.parse(data.rules);
  events = JSON.parse(data.events);

  initRules();
  initEvents();
});

function triggerHandlers(eventName, data) {
    events[eventName].handlers.forEach(function(handler) { handler(data); });
}


function initRules() {
  $(rules).each(function(index, rule) {
    if(!(rule.event_type in events)) {
        console.error('Event not found: ' + rule.event_type + ' for rule:');
        console.log(rule);
        return;
    }

    events[rule.event_type].handlers.push(function(data) {
      console.log('Event ' + rule.event_type + ' triggered for ' + JSON.stringify(rule));

      // Replace content with jQuery
      $(rule.selector).html(rule.replacement);
    });

  });
}

function initEvents() {

  // Timeout event
  var delay = events.timeout.time;
  setTimeout(function() {
    triggerHandlers('timeout', delay);
  }, delay);

}

*/

