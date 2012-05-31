console.warn('loaded content script');

var rules = [];
var events = {};
var history;
console.log(localStorage);
if('history' in localStorage) {
  console.log('Continuing history'); 
  history = JSON.parse(localStorage.history);
} else {
  console.log('Starting new history'); 
  history = {};
}

// Load rules from background script
chrome.extension.sendRequest({type: "get_options"}, function(data) {
  rules = JSON.parse(data.rules);
  events = JSON.parse(data.events);
  localStorage.rules = data.rules;
  localStorage.events = data.events;

  initRules();
  initEvents();
});

function triggerHandlers(eventName, data) {
    events[eventName].handlers.forEach(function(handler) { handler(data); });
}


function initRules() {
  console.log('Loaded rules:');
  console.log(rules);

  $(rules).each(function(index, rule) {
    console.log('Initializing rule ' + index + ':');
    console.log(rule);

    if(!(rule.event_type in events)) {
        console.error('Event not found: ' + rule.event_type);
        return;
    }

    events[rule.event_type].handlers.push(function(data) {
      console.log('Event ' + rule.event_type + ' triggered for ' + JSON.stringify(rule));
      console.log(data);

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

  // History event
  var path = window.location.pathname;
  // Initialize counter for this page
  if(!(path in history)) {
      history[path] = 0;
      localStorage.history = JSON.stringify(history);
  }
  // Update counter every 1s and trigger the history event again
  setInterval(function() {
      history[path] += 1000;
      localStorage.history = JSON.stringify(history);
      triggerHandlers('history', history);
  }, 1000);

}

