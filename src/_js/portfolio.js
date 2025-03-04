var DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug')),
    VERBOSE = false && DEBUG,
    last_known_scroll_position = 0,
    ticking = false;

function wrapElement (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

function isInViewport (elem) {
    var bounding = elem.getBoundingClientRect(),
        peek = 0;//bounding.height / 10;
    // if(VERBOSE) console.log('isInViewport',elem);
    return (
        bounding.bottom >= (0 - peek) &&
        bounding.top <= ((window.innerHeight || document.documentElement.clientHeight) - peek) &&
        // bounding.left >= 0 &&
        // bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        true
    );
}

function parseSrcset(srcset) {
  return srcset.split(',').map(item => {
    const parts = item.trim().split(' ');
    return {
      url: parts[0],
      width: parts[1] ? parseInt(parts[1], 10) : null,
      density: parts[1] && parts[1].includes('x') ? parseFloat(parts[1]) : null,
    };
  });
}

function doParallax (yPos) {
    var spies = document.querySelectorAll('[data-parallax]');
    if(VERBOSE) console.log('doParallax',spies);
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
}

function initMosaics() {
  var mosaics = document.getElementsByClassName('grid well');
  for (const mos of mosaics) {
    var imgs = mos.getElementsByTagName('img');
    console.log('mosaics',imgs)
    for (const img of imgs) {
      img.addEventListener('click',function(e){
        var newImg = document.createElement('img');
        var allSrc = parseSrcset(this.srcset);
            newImg.setAttribute('src',allSrc.pop().url);

        document.getElementById('lightbox').innerHTML = "";
        document.getElementById('lightbox').append(newImg);
        document.getElementById('lightbox').classList.add('in');
      })
    }
  }
  document.getElementById('lightbox').addEventListener('click',()=>{
    document.getElementById('lightbox').classList.remove('in');
  })
}

function onScroll (e) {
    if(VERBOSE) console.log("onScroll",e);
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // scrollSpy(last_known_scroll_position);
            doParallax(last_known_scroll_position);
            // doScrollFade(last_known_scroll_position);
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('keydown', function(e) {
    console.log('onkeydown',e);

    switch(e.keyCode) {
        case 27://escape
          document.getElementById('lightbox').classList.remove("in");
          break;
        default:
    }
    galleryKeyPress(e);
});
window.addEventListener('popstate',function(e){
    galleryPopstate(e);
});

window.addEventListener('load', function(e) {
    console.log('project.window.load',e);
    var zoomies = document.querySelectorAll('.canzoom');
    Object.entries(zoomies).forEach(([key, zoomy]) => {
        console.log(`${key}: ${zoomy}`)
        zoomy.addEventListener('click', function(e) {
            console.log('zoomie clicked!',this);
            // toggleClass(this,'zoom');
            this.classList.toggle('zoom');
        });
    });

    initMosaics();
    window.addEventListener('scroll', onScroll, false);

});