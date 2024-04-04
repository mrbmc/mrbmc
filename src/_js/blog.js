var list_template   = {},
    detail_template = {},
    tumblr_consumer = "vlXKTApWPK66X3VaZxbN9LVynpW7I0svr2PegVJK6QNAJTiM1S",
    tumblr_secret = "GQe1Bpz6z5gUEM4oqJ4EvJsWNq6SRWVkYYKsf2CC6urU4oLQYr",
    tumblr_uuid = "t:bTBKoJnj3DQ5KDS_jJkttQ",
    medium_client = "e92bf9749fcb",
    medium_secret = "6f2fc287c6524bfe0f53be6a9d04800481898398",
    medium_token = "22df0c4e3b76868a3b9a9d3e401eecdb8a5e5ba6a3022c9419e498cd0c697c07f",
    $currentPost = "",
    $pdata = [],
    $postIndex = 0,
    pageIndex = 0,
    pageCount = 10,
    postCount = 0,
    CMS = "medium";//medium|local|tumblr



/* ------------------------------------------------------------
HELPERS
------------------------------------------------------------ */
function getFeedURL () {
    var url;
    var params = new URLSearchParams(window.location.search);
    var _index = params.get('pg') ? (params.get('pg') - 1) : pageIndex;
    var _count = params.get('pp') ? params.get('pp') : pageCount;
    console.log('page:'+_index+" / "+" perpage:"+_count);
    switch (CMS) {
        case "tumblr":
            url = "https://api.tumblr.com/v2/blog/" + 
                            tumblr_uuid + 
                            "/posts?" + 
                            "api_key=" + tumblr_consumer + 
                            "&type=" + "text" +
                            "&limit=" + _count +
                            "&offset=" + (_index * _count) +
                            "";
            // Authenticate via OAuth
            // var tumblr = require('tumblr');
            // var client = tumblr.createClient({
            //   consumer_key: tumblr_consumer,
            //   consumer_secret: tumblr_secret,
            //   token: 'voOxRVr8zRWRPXm8HWxepP7h2rhrchRVY5ruhDFrekG4HuXkNZ',
            //   token_secret: '613MQ2y2oaoxG2ZLuFYqiTGMnASEj3awY3NF1s4pNfjNXi4uMU'
            // });

        break;
        case "medium":
            url = "https://api.rss2json.com/v1/api.json?"+
                    "&rss_url=https://medium.com/feed/brian-mcconnell"+
                    // "&api_key=gumsvskfeypibu9hpzi6anfnuia8zlrrptwkjpqw"+
                    // "&count=1"+
                    // "&order_by=title"+
                    "";
            if(DEBUG) url = "./medium.json";
        break;
        default:
            url = "./blog.json";
    }
    return url;
}

function buildPagination () {
    if(DEBUG) window.console.log('buildPagination',arguments);

    for(var i = 1;i<= Math.ceil(postCount/pageCount);i++) {
        //this IF is a bug. I'm trying to limit the number of items in the pagination
        if(i>=6 && i < Math.ceil(postCount/pageCount)) {
            continue;
        }
        var createAText = document.createTextNode(i);
        var createA = document.createElement('a');
            createA.setAttribute('href', "/blog/?pg="+i);
            createA.appendChild(createAText);
        // var createLI = document.createElement('li');
        //     createLI.appendChild(createA).appendChild(createAText);
        // document.getElementById('pagination').appendChild(createA);
    }

}

/* ------------------------------------------------------------
NAVIGATION FUNCTIONS
------------------------------------------------------------ */

function $gotoIndex(_input) {
    if(DEBUG) window.console.log('gotoIndex',arguments);
    document.getElementById('item-detail').innerHTML = "";
    toggleClass(document.getElementById('item-list'),'mini',false);
    window.document.title = "Notes On Design | Brian McConnell";
    onScroll();
}

function onPostLoaded ( input ) {
    if(DEBUG) window.console.log('onPostLoaded:',arguments);

    //prepare metadata
    if(typeof(input)=="string") {
        var post = $pdata[$postIndex];
            post['content'] = parseMarkdown(input);
    } else {
        var post = input;
    }

    //render the page content
    document.getElementById('item-detail').innerHTML = detail_template(post);
    if(document.getElementById('scrollhint'))
        document.getElementById('scrollhint').addEventListener('click',onClickScrollhint,false);
    // window.document.title = post.title + " | Brian McConnell";
    history.replaceState('',post.title + " | Brian McConnell","/blog/#/" + post.slug);

    //Reset the page styling
    onScroll();
    onResize();
    toggleClass(document.getElementById('item-list'),"mini",true);
    window.scrollTo({left:0,top:0,behavior: 'smooth'});

    //Google Analytics
    if(typeof ga != "undefined")
        ga('send', 'pageview', '/blog/#/' + post.slug);
    $currentPost = (post.slug === $currentPost) ? "" : post.slug;

}

function $gotoPost(_input) {
    if(DEBUG) window.console.log('gotoPost:', arguments);

    var index = $currentPost,
        increment = (_input == "+") ? -1 : 1,
        i,
        d,
        post = {};

    //if the argument is an integer, fetch the data by the index no.
    if ((_input*1) == _input) {
        index = parseInt(_input, 10);
    //if the argument is incremental you go to the sibling project
    } else if (_input === "+" || _input === "-") {
        for (i in $pdata) {
            console.log('i',i);
            if ($pdata.hasOwnProperty(i) && $pdata[i].slug === $currentPost) {
                index = parseInt(i, 10) + increment;
                // //hide the private items from pagination
                // while($pdata[index].privacy == true) {
                //     index += increment;
                // }
                break;
            }
        }

        if(index < 0) index = ($pdata.length - 1);
        if(index >= $pdata.length) index = 0;

    //else we assume the argument was a slug and fetch the index no by the slug
    } else {
        for (i in $pdata) {
            if ($pdata.hasOwnProperty(i) && !$pdata[i].privacy && $pdata[i].slug === _input) {
                index = parseInt(i, 10);
                break;
            }
        }
    }


    $postIndex = index;
    var post = $pdata[$postIndex];


    //load the post content
    console.log('loadThePost',{"index":index,"post":post});
    switch(CMS) {
        case "tumblr":
            onPostLoaded(post);
        break;
        case "medium":
            onPostLoaded(post);
        break;
        default:
            console.log('load the post',"/blog/posts/" + post.slug + ".md");
            loadMarkdown("/blog/posts/" + post.slug + ".md",onPostLoaded);
        break;
    }

    return post;
}

function normalizeData (data) {
    if(DEBUG) console.log('normalizeData', arguments);
    switch (CMS) {
        case "tumblr":
            $pdata = data.response.posts;
            postCount = parseInt(data.response.blog.posts);
            for (i in $pdata) {
                $pdata[i]['content'] = $pdata[i]['body'];
                $pdata[i]['summary'] = formatSummary($pdata[i]['body']);
                $pdata[i]['pubDate'] = formatDate($pdata[i]['date']);
            }
        break;
        case "medium":
            $pdata = data.items;
            postCount = data.items.length;
            for (i in $pdata) {
                $pdata[i]['slug'] = slugify($pdata[i]['title']);
                $pdata[i]['summary'] = formatSummary($pdata[i]['description']);
                $pdata[i]['pubDate'] = formatDate($pdata[i]['pubDate']);
                var r = /jpg|jpeg|png/i,
                    c = $pdata[i]['thumbnail'].match(r);
                if( c != null ){
                    $pdata[i]['masthead'] = {'image':$pdata[i]['thumbnail']};
                } else {
                    delete $pdata[i]['thumbnail'];
                }
                console.log()
            }
        break;
        default:
            $pdata = data.items;
            postCount = data.items.length;
            for (i in $pdata) {
                if($pdata[i]['masthead'] && $pdata[i]['masthead']['image'])
                    $pdata[i]['thumbnail'] = $pdata[i]['masthead']['image'];
            }
    }
}

function onLoadIndex (data) {
    if(DEBUG) window.console.log('onLoadIndex',event);

    normalizeData(data);
    console.log('$pdata',$pdata);

    setTimeout(function(){
        document.getElementById('item-list').innerHTML = list_template($pdata);
        onScroll();
    },0);

    buildPagination();

    var slug = window.location.hash.split('#/').pop();
    if (slug != "") {
        $gotoPost(slug);
    } else {
        $gotoIndex();
    }
}

/* ------------------------------------------------------------
EVENT HANDLERS
------------------------------------------------------------ */

window.onpopstate = function(event) {
    // if(DEBUG) console.log("onPopState","location: " + document.location + ", state: " + JSON.stringify(event.state),event.state);
    if(DEBUG) console.log("onPopState",arguments);
    var slug = window.location.hash.split('#/').pop();
    if (slug != "") {
        $gotoPost(slug);
    } else {
        $gotoIndex();
    }
};

window.addEventListener('DOMContentLoaded', function() {
    "use strict";

    list_template   = Handlebars.templates["post_list.hbs"];
    detail_template = Handlebars.templates["post_detail.hbs"];

    loadJSON(getFeedURL(),onLoadIndex);

});