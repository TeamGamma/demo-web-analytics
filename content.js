console.warn('loaded content script');

var rules = [];
var events = {};

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

    events[rule.event_type].handlers.push(function() {
      console.log('Event ' + rule.event_type + ' triggered for ' + JSON.stringify(rule));

      // Replace content with jQuery
      $(rule.selector).html(rule.replacement);
    });

  });
}

function initEvents() {

  // timeout
  var delay = events.timeout.time;
  setTimeout(function() {
    triggerHandlers('timeout', delay);
  }, delay);

}

