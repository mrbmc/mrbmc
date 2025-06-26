import { isInViewport,parseSrcset,wrapElement } from "./dom_utils.mjs";

export function doParallax (e) {
    // if(VERBOSE) console.log('doParallax',arguments);
    var yPos = window.scrollY;
    var spies = document.querySelectorAll('[data-parallax]');
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
    return spies;
}
