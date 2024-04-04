class Gallery {

	constructor(_target, _source) {
		if(DEBUG) console.log("Gallery.constructor",arguments);
		this.index = 0;
		this.data = _source;
		Array.from(this.data).forEach(function(item,index,array){
			item['index'] = index;
		});
		this.el = (typeof _target == "string") ? document.getElementById(_target) : _target;

		this.buildGallery();

        //SETUP EVENT HANDLERS
        this.hImage.addEventListener('load', (e)=>{
			if(DEBUG) console.log('Gallery.onLoadImage',arguments);
	    	toggleClass(iGallery.hDetail, 'in', true);
        });

		this.el.getElementsByClassName('close')[0].addEventListener('click',function(e) {
			e.preventDefault();
			iGallery.closePhoto(e);
		})

		this.el.getElementsByClassName('page-rev')[0].addEventListener('click',function(e) {
			e.preventDefault();
			iGallery.openPhoto("-");
		})

		this.el.getElementsByClassName('page-fwd')[0].addEventListener('click',function(e) {
			e.preventDefault();
			iGallery.openPhoto("+");
		})

	    window.addEventListener('keydown', function(e){
	        if(DEBUG) console.log('Gallery.keydown',e);
	        e = e || window.event;
	        iGallery.keyListener(e);
	    });

	}

	onLoadImage (e) {
		if(DEBUG) console.log('Gallery.onLoadImage',arguments);
    	toggleClass(iGallery.hDetail, 'in', true);
	}

	keyListener (e) {
        switch(e.keyCode) {
            case 27://escape
                if(this.el.classList.contains('in'))
                    this.closePhoto();
                break;
            case 37://left arrow
                if(this.el.classList.contains('in'))
                    this.openPhoto("-");
                break;
            case 39://right arrow
                if(this.el.classList.contains('in'))
                    this.openPhoto("+");
                break;
            default:
        }
	}

	buildGallery () {
		var _templater = Handlebars.templates["gallery.hbs"];
	    this.el.innerHTML = _templater(this.data);

		this.hDetail = this.el.getElementsByClassName('detail')[0];
		this.hImage = document.getElementById('gallery-image');
		this.hCaption = document.getElementById('gallery-caption');

        this.buildNav();
	}

	buildNav () {
		var items = Array.from(this.el.getElementsByClassName('thumbnail'));
		items.forEach(function (item, index, arr) {
			item.addEventListener('click', function(e) {
				if(DEBUG) console.log('thumbnail.click',e);
				e.preventDefault();
				var href = arguments[0].srcElement.parentElement.getAttribute('href');
				var hash = href.split('#/').slice(-1);
				iGallery.openPhoto({'index':hash[0]});
			});
		});
	}

	updateNav (activeIndex) {
		if(DEBUG) console.log('Gallery.updateNav',arguments);
		var items = Array.from(this.el.getElementsByClassName('thumbnail'));
		items.forEach(function (item, index, arr) {
			toggleClass(item,'active',index==activeIndex);
		});
	}

	getPhoto(key,val) {
		if(DEBUG) console.log("Gallery.getPhoto",arguments);
		for(var index=0; index<=this.data.length; index++) {
			var item = this.data[index];
    		if(item[key] == val) {
                return item;
                break;
    		}
		}
	}

	getIndex(key,val) {
		if(DEBUG) console.log("Gallery.getPhoto",arguments);
		for(var index=0; index<=this.data.length; index++) {
			var item = this.data[index];
    		if(item[key] == val) {
                return index;
                break;
    		}
		}
	}

	openPhoto(input) {
		if(DEBUG) console.log('Gallery.openPhoto', arguments);

        toggleClass(this.el,'in',true);
    	toggleClass(iGallery.hDetail, 'in', false);

        var photo = this.data[0];

		if(typeof input === "number") {
			this.index = parseInt(input);
		} else if(typeof input === "object") {
			for(var key in input) {
				this.index = this.getIndex(key,input[key]);
				break;
			}
		} else if (input == "+") {
			if(this.index < (this.data.length - 1))
				this.index++;
			else 
				this.index = 0;
		} else if (input == "-") {
			if(this.index > 0)
				this.index--;
			else
				this.index = this.data.length - 1;
		}

		photo = this.data[this.index];
        var url = photo['url_h'] || photo['url_o'];

        document.getElementById('gallery-image').setAttribute('src',url);
        document.getElementById('gallery-caption').innerText = photo['title'];

		this.updateNav(this.index);

		// TODO: only want to do this on the Photos section
		// window.location.hash = "/" + photo['id'];
		return true;
	}

	closePhoto(e) {
		if(DEBUG) console.log('Gallery.closePhoto',arguments);
		if(e)
			e.preventDefault();
		toggleClass(this.el,'in',false);
	}

};
