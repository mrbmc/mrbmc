var DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug')),
    VERBOSE = false && DEBUG,
    last_known_scroll_position = 0,
    ticking = false;

Math.contain = function(x, min, max) {
    if(x < min) x=max;
    else if (x > max) x=min;
    return x;
}

function toggleClass(element, _class, b) {
    // if(DEBUG) console.log('toggleClass',arguments);
    if(b !== undefined) {
        switch(b){
            case true:
                element.classList.add(_class);
                break;
            case false:
                element.classList.remove(_class);
                break;
        }
    } else {
        element.classList.toggle(_class);
    }
    return element.classList.value;
}

function wrapElement (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

function isInViewport (elem) {
    var bounding = elem.getBoundingClientRect(),
        peek = 0;//bounding.height / 10;
    // if(VERBOSE) console.log('isInViewport',elem);
    return (
        bounding.bottom >= (0 - peek) &&
        bounding.top <= ((window.innerHeight || document.documentElement.clientHeight) - peek) &&
        // bounding.left >= 0 &&
        // bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        true
    );
}

function scrollSpy(lastY) {
    if(VERBOSE) console.log('scrollSpy');
    "use strict";
    var spies = document.querySelectorAll('[data-spy="scroll"]');
    if(VERBOSE) console.log('scrollSpy.spies',spies.length);
    spies.forEach(function(value,index,array){
        var me = array[index],
            b = isInViewport(me),
            oldClass = me.className,
            newClass = b ?  (oldClass.indexOf(' in')>=0 ? oldClass : oldClass + " in") : oldClass.replaceAll(' in', '');
        me.className = newClass;
    });
}

function doParallax (yPos) {
    var spies = document.querySelectorAll('[data-parallax]');
    if(VERBOSE) console.log('doParallax',spies);
    spies.forEach(function(value,index,array){
        var me = array[index],
            isVisible = isInViewport(me.parentElement),
            innerHeight = window.innerHeight,
            scrolledPercent = ((yPos / (innerHeight * 1)) - 0),
            movementRange = parseInt(me.dataset.parallax),
            val = scrolledPercent * (innerHeight * movementRange / 100);

        if(isVisible) me.style.transform = "translate(0, " + val + "px)";
        // if(isVisible) me.style.opacity = (1 - (scrolledPercent * .75));
    });
}

function doScrollFade (yPos) {
    var spies = document.querySelectorAll('[data-fade]');
    if(VERBOSE) console.log('doScrollFade',spies);
    spies.forEach(function(value,index,array){
        var me = array[index],
            isVisible = isInViewport(me),
            innerHeight = window.innerHeight,
            scrolledPercent = ((yPos / (innerHeight * 1)) - 0),
            movementRange = parseInt(me.dataset.fade),
            val = 1 - (scrolledPercent * (movementRange/100));

        if(isVisible) me.style.opacity = val;
    });
}

// function closeNav (event){
//     var headerElement = document.getElementById('header'),
//         isClickInside = headerElement.contains(event.target),
//         isNavOpen = (headerElement.className.includes(' in'));
//     if(isClickInside || !isNavOpen) return;

//     if(DEBUG) window.console.log('closeNav', event);
//     event.preventDefault();
//     document.getElementById('header').className = document.getElementById('header').className.replace(' in', '');
// }

function onScroll (e) {
    if(VERBOSE) console.log("onScroll",e);
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(function() {
            scrollSpy(last_known_scroll_position);
            doParallax(last_known_scroll_position);
            doScrollFade(last_known_scroll_position);
            ticking = false;
        });
        ticking = true;
    }
}

function onResize() {
    if(DEBUG) console.log('onResize',arguments);

    // var targetPixels = 1440 * 720,
    //     currentPixels = window.innerWidth * window.innerHeight,
    //     pixelRatio = Math.round(currentPixels / targetPixels * 90);
    // var fontSize = Math.min(Math.max(pixelRatio,60),160);
    // document.getElementsByTagName('html')[0].style.fontSize =  fontSize + '%';

}

function onPopState (e){
    "use strict";
    if(DEBUG) console.log('mrbmc.window.onPopState',arguments);
};

function setupEmailLinks () {
    if(DEBUG) console.log('mrbmc.setupEmailLinks',arguments);
    var links = document.getElementsByClassName('link-email');
    for (const link of links) {
      var attrs = link.dataset;
      link.setAttribute(
        "href",
        `mailto:${attrs.part1}@${attrs.part2}.${attrs.part3}?subject=${attrs.part4}`
      );
    }
}

function setupVideos () {
    if(DEBUG) console.log('mrbmc.setupVideos',arguments);
    var videos = document.querySelectorAll('video');
    for (const video of videos) {
        video.addEventListener('click',function(){
            this.play();
        });
    }
}

window.addEventListener('load', function(e) {
    "use strict";
    if(DEBUG) console.log('mrbmc.window.load',arguments);

    //setup navigation
    // document.getElementsByTagName('body')[0].addEventListener('touchend',closeNav,false);

    //setup listeners
    window.addEventListener('resize', onResize, false);
    window.addEventListener('scroll', onScroll, false);
    window.addEventListener('popstate', onPopState, false);
    var loadSpies = document.querySelectorAll('[data-spy="load"]');
    loadSpies.forEach(function(value,index,array){
        var me = array[index];
        toggleClass(me,'in');
    });

    setupEmailLinks();
    setupVideos();

    //repaint as needed
    onResize();
    onScroll(true);

    // if(typeof onPageLoad == "function") onPageLoad(event);

},false);


// if(document.location.hostname!="localhost") {
//   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

//   ga('create', 'UA-4173628-4', 'auto');
//   ga('send', 'pageview');
// }

