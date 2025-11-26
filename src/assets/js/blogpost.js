import { doParallax } from "./modules/parallax.mjs";
import { addLightbox } from "./modules/lightbox.mjs";
import { initStickyNav } from "./modules/sticky-nav.mjs";

window.addEventListener('scroll', function(e) {
    // doParallax(e);

    const bScrolled = (window.pageYOffset >= (window.innerHeight * 0.62));
    document.getElementsByTagName('body')[0].classList.toggle('scrolled',bScrolled);
});

window.addEventListener('scroll', doParallax);

window.addEventListener('load', function(e) {
    //setup lightbox on portfolio images
    document.querySelectorAll('.addLightbox,.grid.well img').forEach(el => {
        addLightbox(el);
    });

    initStickyNav(document.getElementById('subnav'));
    });
