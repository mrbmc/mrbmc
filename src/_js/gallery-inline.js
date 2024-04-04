function galleryLoad (e) {
    if(DEBUG) console.log('galleryLoad',arguments);
    var galleries = document.getElementsByClassName('gallery'),
        src = "#";
    Object.entries(galleries).forEach(([key, gallery]) => {
        // console.log(`${key}: ${gallery}`)
 
        // add anchors to images
        var images = gallery.getElementsByTagName('img');
        Object.entries(images).forEach(([key, img]) => {
            var a = document.createElement('a');
                a.setAttribute('href',"#" + img.getAttribute('src'));
            wrapElement(img,a);

            var caption = document.createElement('p');
                caption.setAttribute('class','caption');
                caption.textContent = img.getAttribute('alt');
            a.parentNode.insertBefore(caption,a.nextSibling);
        });

        // create wrapper container
        var wrapper = document.createElement('div');
            wrapper.setAttribute('class','gallery-wrap');
        wrapElement(gallery, wrapper);

        // create the detail image
        src = gallery.getElementsByTagName('img')[0].getAttribute('src');
        var newImg = document.createElement('img');
            newImg.src = src;
            newImg.setAttribute('class','image-detail');
        wrapper.prepend(newImg);
    });

    var details = document.getElementsByClassName('image-detail');
    Object.entries(details).forEach(([key, detail]) => {
        detail.addEventListener('click', function (e) {
            console.log('click',this.getAttribute('src'));
            window.open(this.getAttribute('src'),"detail");
        })

    });

    updateDetailImage(e);

};

function updateDetailImage (e) {

    var hash = window.location.hash;
    if(hash.match(/gif|png|jpg|jpeg|webp|mp4/g)==null) {
        e.preventDefault();
        return false;
    }

    var clickTarget = document.querySelectorAll("[href='" + hash + "']")[0],
        gallery = clickTarget.closest(".gallery-wrap"),
        src = hash.substr(1);

    gallery.getElementsByClassName('image-detail')[0].src = src;
    return true;
}

function prevImage(e) {
    if(DEBUG) console.log('prevImage',e);
    var hash = window.location.hash,
        currentImage = document.querySelectorAll("[href='" + hash + "']")[0],
        prevImage = currentImage.closest("li").previousElementSibling;

    if(prevImage != null) {
        var src = prevImage.querySelectorAll('a')[0].getAttribute('href');
        history.pushState({},"",src);
        galleryPopstate(e);
    }
    console.log('currentImage',currentImage);
    console.log('prevImage',prevImage);
}

function nextImage(e) {
    if(DEBUG) console.log('nextImage',e);
    var slug = window.location.hash.substr(1),
        currentImage = document.querySelectorAll("[href='#" + slug + "']")[0],
        nextImage = currentImage.closest("li").nextElementSibling;

    if(nextImage != null) {
        var src = nextImage.querySelectorAll('a')[0].getAttribute('href');
        history.pushState({},"",src);
        galleryPopstate(e);
    }
}

function galleryPopstate (e) {
    if(DEBUG) console.log("Gallery.onPopState",e);

    return updateDetailImage(e);
};

function galleryKeyPress(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
        prevImage(e);
    }
    else if (e.keyCode == '39') {
       // right arrow
        nextImage(e);
    }

}
