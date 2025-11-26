import { addLightbox } from "./modules/lightbox.mjs";
import { initStickyNav } from "./modules/sticky-nav.mjs";

window.addEventListener('load', function(e) {

  // wire up the nickname tooltip
  document.querySelector("a[href='#killabmc']").addEventListener('mouseover',function(event){
      const tip = document.getElementById('killabmc');
      var xposition = (event.clientX - this.offsetLeft);
      var yposition = (event.clientY - this.offsetTop);
      tip.style.left = (this.offsetLeft - (tip.offsetWidth / 2)) + "px";
      tip.style.top = (this.offsetTop - tip.offsetHeight) + "px";
      tip.classList.add("in");
  });
  document.querySelector("a[href='#killabmc']").addEventListener('mouseout',function(event){
      const tip = document.getElementById('killabmc');
      tip.classList.remove("in");
  });

  var lightBoxes = document.querySelectorAll('.addLightbox');
      lightBoxes.forEach(el => {
        addLightbox(el);
      });

  initStickyNav(this.document.getElementById('subnav'));

});
