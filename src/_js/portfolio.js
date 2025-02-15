var DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug')),
    VERBOSE = false && DEBUG,
    last_known_scroll_position = 0,
    ticking = false;

function wrapElement (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

function initMosaics() {
  var mosaics = document.getElementsByClassName('mosaic');
  for (const mos of mosaics) {
    var imgs = mos.getElementsByTagName('img');
    console.log('mosaics',imgs)
    for (const img of imgs) {
      img.addEventListener('click',function(e){
        var newImg = document.createElement('img');
            newImg.setAttribute('src',this.src);

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

});