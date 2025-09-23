import { doParallax } from "./modules/parallax.mjs";
import { addLightbox } from "./modules/lightbox.mjs";

window.addEventListener('scroll', function(e) {
    // doParallax(e);

    const bScrolled = (window.pageYOffset >= (window.innerHeight * 0.62));
    document.getElementsByTagName('body')[0].classList.toggle('scrolled',bScrolled);
});

window.addEventListener('scroll', doParallax);

window.addEventListener('load', function(e) {
    var zoomies = document.querySelectorAll('.addLightbox');
    zoomies.forEach(el => {
        addLightbox(el);
    });
    var imgs = document.querySelectorAll('.grid.well img');
        imgs.forEach(img => {
            addLightbox(img);
        })
});
