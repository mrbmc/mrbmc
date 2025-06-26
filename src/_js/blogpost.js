import { doParallax } from "./modules/parallax.mjs";

window.addEventListener('scroll', function(e) {
    // doParallax(e);

    const bScrolled = (window.pageYOffset >= (window.innerHeight * 0.62));
    document.getElementsByTagName('body')[0].classList.toggle('scrolled',bScrolled);
});

window.addEventListener('scroll', doParallax);
