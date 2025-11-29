import { initCritters } from "./modules/critters.mjs";

/* * * * * * * * * * * * * * * * * * * * *
CONFIGURATION
* * * * * * * * * * * * * * * * * * * * */
const DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));
const MOBILE = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
var VERBOSE = false && DEBUG,
    last_known_scroll_position = 0;
const observer = new IntersectionObserver(intersectionCallback, {});


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

function intersectionCallback(entries, observer) {
    console.log('intersectionCallback');
    entries.forEach(entry => {
        if(entry.target.id === 'header') {
            // console.log('Header visibility changed:', entry.isIntersecting);
            document.querySelector('.nav-top').classList.toggle('hide',entry.isIntersecting);
        } else {
            // console.log('Element entered viewport:', entry.target.id);
            entry.target.classList.toggle('in',entry.isIntersecting);
        }
    });
}

function initAnimations() {
    console.log('initAnimations');
    document.querySelectorAll('.blur-in,.fade-in,.build-in').forEach(element => {
        observer.observe(element);
    });
    observer.observe(document.getElementById('header'));
}

/* * * * * * * * * * * * * * * * * * * * *
EVENT LISTENERS
* * * * * * * * * * * * * * * * * * * * */
window.addEventListener('load', function(e) {
    "use strict";
    initEmails();
    initAnimations();
    initCritters();
},false);

import "./modules/ga.mjs";

