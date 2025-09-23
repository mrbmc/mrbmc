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

function markdownParse(markdownText) {
    if(DEBUG) console.log("markdownParse",arguments);
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

