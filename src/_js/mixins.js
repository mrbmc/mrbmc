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

function markdownGallery (match,str,offset,string) {
    console.log('markdownGallery',arguments);
    var img = str.replace(/!\[(.*?)\]\((.*?)\)/gim, "$2");
    var out = '<ul class="gallery"><li>';
        out += str.replace(/\|\|/gim, '</li><li>');
        out += '</li></ul>';
    return out;
}

function markdownTable (match,str,offset,string) {
    //if(DEBUG) console.log('markdownTable',arguments);
    var rows = str.trim().split("\n");
    var out = "<table>";
    rows.forEach(function( item, index ){
        var tag = "td";
        if(index == 0) {
            out += "<thead>";
            tag = "th";
        }
        out += '<tr>';
        item.split("|").forEach(function ( cell ) {
            if(cell.trim())
                out += "<"+tag+">" + cell.trim() + "</"+tag+">";
        });
        out += "</tr>";
        if(index == 0) {
            out += "</thead><tbody>";
        }
    });
    out += "</tbody></table>";
    return out;
}

function parseMarkdown(markdownText) {
    if(DEBUG) console.log("parseMarkdown",arguments);
    var htmlText = markdownText.trim()
        .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*([\w\s]*)\*\*/gim, '<b>$1</b>')
        .replace(/\_\_([\w\s]*)\_\_/gim, '<i>$1</i>')
        .replace(/^--+$/gim, '<hr>')
        .replace(/(^[\-\*\+]? .+[\n\r]+)+/gim, '<ul>\n$&\n</ul>')
        .replace(/(^\d+\. .+[\n\r]+)+/gim, '<ol>\n$&\n</ol>')
        .replace(/^[\-\*\+\d]+\.? (.*$)/gim, '<li>$1</li>')
        .replace(/^\| ([\s\S\d\w]*) \|$/gim, markdownTable)
        .replace(/^\|\|(.*)\s?\|\|*$/gim, markdownGallery)
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/(^[\w\d\"\'].+($))/gim, '<p>$1</p>')
        .replace(/(^[\n\r]{2,})/gim, '<p><br ></p>')
        // .replace(/(.+((\r?\n.+)*))/gim, '<p>$1</p>')
        // .replace(/\n$/gim, '<br />')
    return htmlText.trim();
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

