var flickr = {

    key: "41392a7d72d8ac7bd82ae6b2006dc61a",
    secret: "57bd6c9b8bd55ad6",
    userID: "53646203@N08",

    getURL: function (page,perpage) {
        var uri = "https://api.flickr.com/services/rest/?";
            uri+= "&api_key=" + this.key;
            // uri+= "&method=flickr.photos.search";
            uri+= "&method=flickr.people.getPhotos";
            uri+= "&user_id=" + this.userID;
            uri+= "&format=json&nojsoncallback=1";
            // uri+= "&content_type=1";
            uri+= "&page=" + page;
            uri+= "&per_page=" + perpage;
            uri+= "&sort=interestingness-desc";
            // uri+= "&license=4,5,6,7,8";
            uri+= "&extras=date_taken,geo,tags,url_t,url_o,url_h";
            // uri+= "&tags="+tags;

        // var uri = "./photos.json";

        return uri;
    },
    loadImages: function(callback,page,perpage) {
        var page = (page) ? page : 0,
            perpage = (perpage) ? perpage : 20;

		loadJSON(this.getURL(page,perpage), function(data){
            var item,src;
            for(var i=0,max=data.photos.photo.length;i<max;i++) {
                item = data.photos.photo[i];
            }
            callback(data.photos.photo);
        });
    }
}
