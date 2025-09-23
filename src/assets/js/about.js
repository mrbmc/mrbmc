import { isInViewport } from './modules/dom_utils.mjs';
import { addLightbox } from "./modules/lightbox.mjs";

function aboutScroll (e) {
	document.querySelectorAll('section').forEach(el => {
		var bVisible = isInViewport(el,-1);
		console.log('el#'+el.id,bVisible);
		let navItem = document.querySelector('a[href*="#'+el.id+'"]');
		if(navItem)
			navItem.classList.toggle('on',bVisible);
	});
}

window.addEventListener('load', function(e) {

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

  var zoomies = document.querySelectorAll('.addLightbox');
      zoomies.forEach(el => {
        addLightbox(el);
      });

});

window.addEventListener('scroll', aboutScroll);
