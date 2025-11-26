import { doParallax } from "./modules/parallax.mjs";
import { addLightbox } from "./modules/lightbox.mjs";
import { initGallery, galleryPopstate, galleryKeyPress } from "./modules/gallery-inline.mjs";
import { initStickyNav } from "./modules/sticky-nav.mjs";
// import { init } from "gulp-sourcemaps";

globalThis.DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));
globalThis.VERBOSE = false && DEBUG;

var last_known_scroll_position = 0,
    p_ticking = false;

function initMosaics() {
    var imgs = document.querySelectorAll('.grid.well img');
    imgs.forEach(img => {
        addLightbox(img);
    })
    var zoomies = document.querySelectorAll('.addLightbox');
    zoomies.forEach(el => {
        addLightbox(el);
    });
}

window.addEventListener('popstate', function(e) {
    galleryPopstate(e);
});

window.addEventListener('load', function(e) {
    console.log('project.window.load', e);
    initMosaics(e);
    initGallery(e);

    initStickyNav(document.getElementById('subnav'));
});

window.addEventListener('scroll', doParallax);

