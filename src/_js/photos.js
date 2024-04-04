var DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug')),
    VERBOSE = false && DEBUG,
    last_known_scroll_position = 0,
    ticking = false;

var oldPage = 0;

function onScroll() {
    if(DEBUG) console.log('photos.onScroll');
    "use strict";
    var spies = document.querySelectorAll('[data-spy="scroll"]');
    if(VERBOSE) console.log('scrollSpy.spies',spies.length);
    spies.forEach(function(value,index,array){
        var me = array[index],
            b = isInViewport(me),
            oldClass = me.className,
            newClass = b ?  (oldClass.indexOf(' in')>=0 ? oldClass : oldClass + " in") : oldClass.replaceAll(' in', '');
        me.className = newClass;
        if(b)
          me.src = me.dataset.src;
    });
}

window.addEventListener('scroll', onScroll, false);

window.addEventListener('load', function() {
    "use strict";
    if(DEBUG) console.log('photos.window.load',arguments);

    onScroll();
});

