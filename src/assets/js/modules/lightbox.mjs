import { parseSrcset } from "./dom_utils.mjs";

let bHasLightboxes = false;
window.lightboxIndex = [];

function prevImage() {
    console.log('lightbox.previmage');
    let cur = document.querySelector('#lightbox img').src;
    window.lightboxIndex.forEach((obj,index)=>{
        let src = getSrc(obj);
        if(cur.indexOf(src)>=0) {
            console.log("match",index);
            let newSrc = getSrc(window.lightboxIndex[(index-1)]);
            document.querySelector('#lightbox img').src = newSrc;
            return;
        }
    })
}
function nextImage() {
    console.log('lightbox.nextimage');
    let cur = document.querySelector('#lightbox img').src;
    window.lightboxIndex.forEach((obj,index)=>{
        let src = getSrc(obj);
        if(cur.indexOf(src)>=0) {
            console.log("match",index);
            let newSrc = getSrc(window.lightboxIndex[(index+1)]);
            document.querySelector('#lightbox img').src = newSrc;
            return;
        }
    })
}

function getSrc(element) {
    var newSrc = element.src,
        srcSet = parseSrcset(element.srcset).pop().url;

    if(srcSet!=""){
        newSrc = srcSet;
    }

    return newSrc;
}

export function addLightbox (obj) {
    // console.log('addLightbox',obj);

    if(!bHasLightboxes) initLightbox();

    window.lightboxIndex.push(obj);

    obj.addEventListener('click', function(e) {
        document.querySelector('#lightbox img').src = getSrc(this);
        document.getElementById('lightbox').classList.add('in');
    })

    obj.classList.add('hasLightbox');
}


function initLightbox () {
    if(bHasLightboxes) return;

    console.log('initLightbox');

    let el = document.createElement('div');
        el.id = "lightbox";
    let img = document.createElement('img');
        el.append(img);
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
            case 37://left arrow
                prevImage();
              break;
            case 39://right arrow
                nextImage();
              break;
            default:
        }

        // galleryKeyPress(e);
    });

    bHasLightboxes = true;
}

