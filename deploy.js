var http = require('http');
var fs = require('fs');

fs.readFile('./index.html', 'utf8',function (err, html) {
  if (err)
      throw err; 
  generateSingleFileMap(html);
});

function generateSingleFileMap(html) {
  
  fs.readFile('./mapgnd.js', 'utf8',function (err, js) {
    if (err)
        throw err; 
    js = "<script type='text/javascript'>"+js+"</script>";

    fs.readFile('./main.css', 'utf8',function (err, css) {
      if (err)
          throw err; 
      css = "<style type='text/css' rel='stylesheet'>"+css+"</style>";

      html = html.replace("<link type='text/css' href='main.css' rel='stylesheet' id='mapStyle'/>",css);
      html = html.replace("<script type='text/javascript' src='mapgnd.js' id='mapScript'></script>",js);
      html = html.replace("'/locations.json'","'/wp-content/uploads/2020/11/locations.json'");
      html = html.replace(/(\r\n|\n|\r)/gm, ' ');
      html = html.replace(/\s\s+/g, ' ');

      fs.writeFile('map.html', html, function (err) {
        if (err) return console.log(err);
        console.log('single map file generated');
      });

      //send map to wordpress.
    });
  });

}

function minifyHTML(parts, ...values) {
  var out = [];
  out.push(parts[0]);
  for (var i = 1; i<parts.length; i++)
      out.push(parts[i], String(arguments[i]));
  return out.join("");
}

console.log("done");


