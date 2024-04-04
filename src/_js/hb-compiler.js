var templateFile = process.argv[2],
    outputFile = process.argv[3];

var fs = require('fs');
var Handlebars = require('handlebars');

Handlebars.registerHelper("dateHelper", function(inDate, inFormat) {
    // if(DEBUG) console.log("dateHelper: "+inDate+" => "+inFormat);
    var d = new Date(inDate);
    return new Handlebars.SafeString(d.toLocaleDateString());
});
Handlebars.registerHelper('slugify', function (str) {
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

    return new Handlebars.SafeString(str);
});
Handlebars.registerHelper("summarize", function( txt ){
  // exit now if text is undefined 
  if(typeof txt == "undefined") return;
  var output = stripTags(txt).split("\n")[1];
  // if(DEBUG) console.log(output)
  return output + "...";
});
Handlebars.registerHelper("readingTime", function( txt ) {
    // if(DEBUG) console.log("dateHelper: "+inDate+" => "+inFormat);
    if(typeof txt == "undefined") return;
    var rawText = stripTags(txt),
        wordCount = rawText.split(" ").length,
        wpm = 130,
        min = Math.ceil(wordCount / wpm),
        sec = Math.round(((wordCount % wpm)/wpm)*60);
    return min;// + ":" + ((sec>=10)?sec:"0"+sec);
});


function render(filename, data)
{
  var source   = fs.readFileSync(filename,'utf8').toString();
  var template = Handlebars.compile(source);
  var output = template(data);
  return output;
}



var partials = ['header','footer','project_list'];

for (var i = partials.length - 1; i >= 0; i--) {
  var pName = partials[i],
    pFile = "./lib/templates/" + pName + ".hbs";
  Handlebars.registerPartial(pName, fs.readFileSync(pFile,'utf8'));
}

var projects_data = JSON.parse(fs.readFileSync("./lib/js/portfolio.json", 'utf8'));//,
//     projects_template = fs.readFileSync('./lib/templates/project_list.hbs','utf8').toString(),
//     projects_compiled = Handlebars.compile(projects_template),
//     projects_html = projects_compiled(projects_data);

// console.log('projects',projects_html);

var result = render(templateFile, {
  'projects': projects_data
});

fs.writeFileSync(outputFile, result);


