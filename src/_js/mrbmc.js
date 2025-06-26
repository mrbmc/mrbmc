var DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug')),
    VERBOSE = false && DEBUG,
    last_known_scroll_position = 0,
    ticking = false;

function initEmails(){
    // console.log('initEmails');
    Array.from(document.getElementsByClassName('link-email')).map(link => {
      var attrs = link.dataset;
      link.setAttribute(
        "href",
        `mailto:${attrs.part1}@${attrs.part2}.${attrs.part3}?subject=${attrs.part4}`
      );
  })
}

function initAnimations() {
    Array.from(document.getElementsByClassName('blur-in')).map(element => {
        element.classList.toggle('in',true);
    });
    Array.from(document.getElementsByClassName('fade-in')).map(element => {
        element.classList.add('in',true);
    });
};

window.addEventListener('load', function(e) {
    "use strict";
    initEmails();
    initAnimations();
},false);


import "./modules/critters.mjs";
// import "./modules/ga.mjs";
