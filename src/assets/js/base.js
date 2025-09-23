/* * * * * * * * * * * * * * * * * * * * *
CONFIGURATION
* * * * * * * * * * * * * * * * * * * * */
const DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));
const MOBILE = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
var VERBOSE = false && DEBUG,
    last_known_scroll_position = 0;

/* * * * * * * * * * * * * * * * * * * * *
FUNCTIONS
* * * * * * * * * * * * * * * * * * * * */
import { isInViewport } from './modules/dom_utils.mjs';

function initEmails(){
    if(DEBUG) console.log('initEmails');
    Array.from(document.getElementsByClassName('link-email')).map(link => {
      var attrs = link.dataset;
      link.setAttribute(
        "href",
        `mailto:${attrs.part1}@${attrs.part2}.${attrs.part3}?subject=${attrs.part4}`
      );
  })
}

function animateElementsInView() {
    Array
    .from(document.querySelectorAll('.blur-in,.fade-in,.build-in'))
    .map(element => {
        element.classList.toggle('in',isInViewport(element));
    });
}

function baseScroll (e) {
    animateElementsInView();
}

/* * * * * * * * * * * * * * * * * * * * *
EVENT LISTENERS
* * * * * * * * * * * * * * * * * * * * */
window.addEventListener('load', function(e) {
    "use strict";
    initEmails();
    animateElementsInView();
},false);

window.addEventListener('scroll', baseScroll);



/* * * * * * * * * * * * * * * * * * * * *
MODULES
* * * * * * * * * * * * * * * * * * * * */
import "./modules/critters.mjs";

// import "./modules/ga.mjs";
