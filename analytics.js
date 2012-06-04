console.warn('analytics loaded');
var rules, events, options;

var optionSet = function(option) {
  return option in options && options[option] === true;
};

// Load options from background script
chrome.extension.sendRequest({type: "getOptions"}, function(data) {
  rules = JSON.parse(data.rules);
  events = JSON.parse(data.events);
  options = JSON.parse(data.options);

  init();
});


/*
    jquery.tabSlideOUt.js v1.3
    By William Paoli: http://wpaoli.building58.com
*/
(function(e){e.fn.tabSlideOut=function(t){var n=e.extend({tabHandle:".handle",speed:300,action:"click",tabLocation:"left",topPos:"200px",leftPos:"20px",fixedPosition:!1,positioning:"absolute",pathToTabImage:null,imageHeight:null,imageWidth:null,onLoadSlideOut:!1},t||{});n.tabHandle=e(n.tabHandle);var r=this;n.fixedPosition===!0?n.positioning="fixed":n.positioning="absolute",document.all&&!window.opera&&!window.XMLHttpRequest&&(n.positioning="absolute"),n.pathToTabImage!=null&&n.tabHandle.css({background:"url("+n.pathToTabImage+") no-repeat",width:n.imageWidth,height:n.imageHeight}),n.tabHandle.css({display:"block",textIndent:"-99999px",outline:"none",position:"absolute"}),r.css({"line-height":"1",position:n.positioning});var i={containerWidth:parseInt(r.outerWidth(),10)+21+"px",containerHeight:parseInt(r.outerHeight(),10)+"px",tabWidth:parseInt(n.tabHandle.outerWidth(),10)+"px",tabHeight:parseInt(n.tabHandle.outerHeight(),10)+"px"};if(n.tabLocation==="top"||n.tabLocation==="bottom")r.css({left:n.leftPos}),n.tabHandle.css({right:0});n.tabLocation==="top"&&(r.css({top:"-"+i.containerHeight}),n.tabHandle.css({bottom:"-"+i.tabHeight})),n.tabLocation==="bottom"&&(r.css({bottom:"-"+i.containerHeight,position:"fixed"}),n.tabHandle.css({top:"-"+i.tabHeight}));if(n.tabLocation==="left"||n.tabLocation==="right")r.css({height:i.containerHeight,top:n.topPos}),n.tabHandle.css({top:0});n.tabLocation==="left"&&(r.css({left:"-"+i.containerWidth}),n.tabHandle.css({right:"-"+i.tabWidth})),n.tabLocation==="right"&&(r.css({right:"-"+i.containerWidth}),n.tabHandle.css({left:"-"+i.tabWidth}),e("html").css("overflow-x","hidden")),n.tabHandle.click(function(e){e.preventDefault()});var s=function(){n.tabLocation==="top"?r.animate({top:"-"+i.containerHeight},n.speed).removeClass("open"):n.tabLocation==="left"?r.animate({left:"-"+i.containerWidth},n.speed).removeClass("open"):n.tabLocation==="right"?r.animate({right:"-"+i.containerWidth},n.speed).removeClass("open"):n.tabLocation==="bottom"&&r.animate({bottom:"-"+i.containerHeight},n.speed).removeClass("open")},o=function(){n.tabLocation=="top"?r.animate({top:"-3px"},n.speed).addClass("open"):n.tabLocation=="left"?r.animate({left:"-3px"},n.speed).addClass("open"):n.tabLocation=="right"?r.animate({right:"-3px"},n.speed).addClass("open"):n.tabLocation=="bottom"&&r.animate({bottom:"-3px"},n.speed).addClass("open")},u=function(){r.click(function(e){e.stopPropagation()}),e(document).click(function(){s()})},a=function(){n.tabHandle.click(function(e){r.hasClass("open")?s():o()}),u()},f=function(){r.hover(function(){o()},function(){s()}),n.tabHandle.click(function(e){r.hasClass("open")&&s()}),u()},l=function(){s(),setTimeout(o,500)};n.action==="click"&&a(),n.action==="hover"&&f(),n.onLoadSlideOut&&l()}})(jQuery);


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


  if(optionSet('solace-content-viewing') &&
     window.location.host === 'solacesystems.com' &&
     window.location.pathname === '/solutions/messaging-middleware/') {

    console.log('solace-content-viewing enabled');
    solace_content_viewing();

  } else { console.log('solace-content-viewing disabled'); }

  if(optionSet('solace-interest-detection') &&
     window.location.host === 'solacesystems.com') {

    console.log('solace-interest-detection enabled');
    solace_interest_detection();

  } else { console.log('solace-interest-detection disabled'); }

  if(optionSet('solace-page-sets') &&
     window.location.host === 'solacesystems.com') {

    console.log('solace-page-sets enabled');
    solace_page_sets();

  } else { console.log('solace-page-sets disabled'); }

};


/*-----------------------------------------------------------------------------

   CONTENT VIEWING DETECTION

-----------------------------------------------------------------------------*/
var solace_content_viewing = (function() {

// Add sidebar
$(function(){
  $(document.body).append('<div class="slide-out-div">' + 
  '<a class="handle" href="http://link-for-non-js-users.html"><span>More Information</span></a>' +
  '<h3>More about this product</h3>' + 
  '<ul>' + 
  '<li><a href="#">Custom Features</a></li>' +
  '<li><a href="#">Deployment and Support</a></li>' +
  '<li><a href="#">Request a Quote</a></li>' +
  '</ul></div>');

  $('.slide-out-div').tabSlideOut({
    tabHandle: '.handle',                     //class of the element that will become your tab
    pathToTabImage: chrome.extension.getURL('tab.png'),
    imageHeight: '146px',                     //height of tab image           //Optionally can be set using css
    imageWidth: '40px',                       //width of tab image            //Optionally can be set using css
    tabLocation: 'left',                      //side of screen where tab lives, top, right, bottom, or left
    speed: 300,                               //speed of animation
    action: 'click',                          //options: 'click' or 'hover', action to trigger animation
    topPos: '1000px',                          //position from the top/ use if tabLocation is left or right
    leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top
    fixedPosition: false,                      //options: true makes it stick(fixed position) on scroll
    onLoadSlideOut: false
  });

  $('.slide-out-div').css({
    'background-color': '#BBB',
    padding: '10px',
    'line-height': '2em',
    height: '146px',
    '-webkit-box-sizing': 'border-box',
    border: '1px solid white',
    'text-align': 'center',
  })
  .hide()
  .find('.handle').css({
    '-webkit-box-shadow': '0 0 8px #080707',  
  });
});


// Modifies page based on scrolling location
var y1 = 1200;
var y2 = 1400;
var flag = 0;

// This event handler is to detect mouse activity
// If mouse moves, call the function !! to take action
// This does same thing: window.onmousemove = mouse_move;
window.addEventListener("scroll", scroll_hand);

// This fuction performs a certain action once focused on the specified zone
function inZone()
{
  $('.slide-out-div').fadeIn(500);	
};

// This fuction performs a certain action once the visitor is blurred from specified zone
function outZone()
{
  $('.slide-out-div').fadeOut(500);	
};

// This fucntion is called upon mouse acitivity
// If flag == 1
function scroll_hand()
{
  var e = window.event;
  var buttom = window.scrollY + window.innerHeight;
  //console.log("Window top = " + window.scrollY + "; Window buttom = " + buttom);
  if((y1 > window.scrollY ) && ( y2 < (window.scrollY + window.innerHeight)))
  {
    if(flag === 0)
    {
      flag = 1;
      
      // Call function to react to being in the zone
      inZone();
      
    }
    else
    {
      //console.log("You are still in zone and flag = " + flag);
      
    };
  }
  else
  {
    flag = 0;
    
    // Call function to react to leaving the zone.
    outZone();
    //console.log("You are out of zone and flag = " + flag);
  };

  
}

});

/*-----------------------------------------------------------------------------

   INTEREST DETECTION

-----------------------------------------------------------------------------*/
var solace_interest_detection = (function() {

});



/*-----------------------------------------------------------------------------

   RELATED PAGE VISITS DETECTION

-----------------------------------------------------------------------------*/
var solace_page_sets = (function() {

});

