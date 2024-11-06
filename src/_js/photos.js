var DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug')),
    VERBOSE = DEBUG && false,
    last_known_scroll_position = 0,
    ticking = false;

var oldPage = 0;

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
function onScroll() {
    if(VERBOSE) console.log('photos.onScroll');
    "use strict";
    var spies = document.querySelectorAll('[data-spy="scroll"]');
    if(VERBOSE) console.log('scrollSpy.spies',spies.length);
    spies.forEach(function(value,index,array){
        var me = array[index],
            b = isInViewport(me),
            oldClass = me.className,
            newClass = b ?  (oldClass.indexOf(' in')>=0 ? oldClass : oldClass + " in") : oldClass.replaceAll(' in', '');
        me.className = newClass;
        // if(b)
        //   me.src = me.dataset.src;
    });
}

window.addEventListener('scroll', onScroll, false);

window.addEventListener('load', function() {
    "use strict";
    if(DEBUG) console.log('photos.window.load',arguments);

    onScroll();
});

