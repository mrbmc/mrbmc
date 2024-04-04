var iGallery;
onPageLoad = function() {
    "use strict";
  if (DEBUG) console.log('onPageLoad', arguments);

    iGallery = new Gallery(document.getElementsByClassName('gallery')[0]);

    window.onpopstate = function() {
        if(DEBUG) console.log("Gallery.onPopState",arguments);
        var slug = window.location.hash.substr(2),
            src = "#";
        if (slug == "") {
          src = Array.from(document.getElementsByClassName('thumbnail'))[0].dataset.src;
        } else {
          src = document.getElementById("t-"+slug).dataset.src;
        }
        iGallery.openPhoto(src);
    };

    window.onpopstate();
};
