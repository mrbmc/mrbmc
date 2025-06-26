function formatDate (inDate) {
    if(DEBUG) window.console.log('formatDate', arguments);

    var a = [];
    inDate.split(/[^0-9]/).forEach(function (s, index) {
        a.push(parseInt(s, 10));
    });
    var d = new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
    return d.toLocaleDateString();
}

function formatSummary (output) {
    if(DEBUG) console.log("formatSummary",[output]);

    // exit now if text is undefined 
    if(typeof output == "undefined") return;

    // output = stripTags(output);
    // output = output.trim();
    // output = output.split("\n")[0];

    output = stripTags(output)
            .trim()
            .split("\n")
            [0] + 
            "...";

    return output;
}

function stripTags(html) {
   return html.replace(/<[^>]*>?/gm, '');
}

function parseYAML(yamlText) {
    if(DEBUG) console.log('parseYAML',arguments);
    var data = {};
    if(yamlText.indexOf('---\n')>=0) {
        //first separate the metadata from the data
        var doc = yamlText.split("---");
        var content = doc[1].trim();
        var metadata = doc[0].trim();

        // //parse the metadata
        metadata = metadata.split(/\n?(\w+):\s?/);
        if((metadata.length % 2)===1) {
            metadata.shift();
        }
        metadata.forEach(function (element, index, array) {
            if(index%2 == 0) {
                var k = element;
                var v = metadata[(index+1)];
            } else {
                var k = metadata[(index-1)];
                var v = element;
            }
            data[k] = v;
        });
        data['summary'] = data['summary'].replace(/^\|\n/,"");
        data['content'] = content;
    } else {
        data['content'] = data;
    }
    console.log('YAML metadata',data);
    return data;
}

function slugify (str) {
    //strip special chars
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

function getReadingTime ( txt ) {
    // if(DEBUG) console.log("dateHelper: "+inDate+" => "+inFormat);
    if(typeof txt == "undefined") return;
    var rawText = stripTags(txt),
        wordCount = rawText.split(" ").length,
        wpm = 130,
        min = Math.ceil(wordCount / wpm),
        sec = Math.round(((wordCount % wpm)/wpm)*60);
    return min;// + ":" + ((sec>=10)?sec:"0"+sec);
}

Math.contain = function(x, min, max) {
    if(x < min) x=max;
    else if (x > max) x=min;
    return x;
}


