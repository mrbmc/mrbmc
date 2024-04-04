window.addEventListener('keydown', function(e) {
    console.log('onkeydown',e);
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
            toggleClass(this,'zoom');
        });
    });


    galleryLoad(e);
});

