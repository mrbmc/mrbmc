class Gallery {

	constructor(_target) {
		if(DEBUG) console.log("Gallery.constructor",arguments);

		this.el = _target;

        this.buildGallery();

	}

	buildGallery() {
		this.hDetail = this.el.getElementsByClassName('detail')[0];
		this.hImage = this.el.getElementsByClassName('image-detail')[0];
		this.hCaption = this.el.getElementsByClassName('image-caption')[0];

		//Wire up the navigation
		this.thumbs = this.el.getElementsByClassName('thumbnail');
		for (var i = this.thumbs.length - 1; i >= 0; i--) {
		    // this.thumbs[i].addEventListener('click',function(e) {
			// 	e.preventDefault();
			// 	console.log('clicky',this.dataset.src);
			// 	iGallery.openPhoto(this.dataset.src);
			// });
		}

		// Loading notifications
        this.hImage.addEventListener('load', (e)=>{
			if(DEBUG) console.log('Gallery.onLoadImage',arguments);
	    	toggleClass(iGallery.hDetail, 'in', true);
        });

	}

	onLoadImage (e) {
		if(DEBUG) console.log('Gallery.onLoadImage',arguments);
    	toggleClass(iGallery.hDetail, 'in', true);
	}

	openPhoto(input) {
		if(DEBUG) console.log('Gallery.openPhoto', arguments);
    	toggleClass(iGallery.hDetail, 'in', false);
		var tgt = this.el.getElementsByClassName('image-detail')[0];
		tgt.src = input;
	}
}