import { parseSrcset } from "./dom_utils.mjs";

let bHasLightboxes = false;


export function addLightbox (obj) {
    console.log('addLightbox',obj);

    if(!bHasLightboxes) initLightbox();

    obj.addEventListener('click', function(e) {
        var newObj = document.createElement('img'),
            newSrc = this.src,
            srcSet = parseSrcset(this.srcset).pop().url;

        if(srcSet!=""){
            newSrc = srcSet;
        }

        newObj.setAttribute('src', newSrc);
        document.getElementById('lightbox').innerHTML = "";
        document.getElementById('lightbox').append(newObj);
        document.getElementById('lightbox').classList.add('in');
    })

    obj.classList.add('hasLightbox');
}


function initLightbox () {
    if(bHasLightboxes) return;

    console.log('initLightbox');

    let el = document.createElement('div');
        el.id = "lightbox";
    document.getElementsByTagName('main')[0].append(el);

    el.addEventListener('click',()=>{
        el.classList.remove('in');
    })

    window.addEventListener('keydown', function(e) {
        console.log('onkeydown',e);

        switch(e.keyCode) {
            case 27://escape
              document.getElementById('lightbox').classList.remove("in");
              break;
            default:
        }

        // galleryKeyPress(e);
    });

    bHasLightboxes = true;
}

