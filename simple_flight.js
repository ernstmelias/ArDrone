var arDrone = require('ar-drone');
var http    = require('http');
var Canvas, Image, canvas, ctx, pngStream, rgh2hsl, standby , lastPng;
var client = arDrone.createClient();
client.disableEmergency();
Canvas = require('canvas');
canvas = new Canvas(440, 270);
ctx = canvas.getContext('2d');
Image = Canvas.Image;
rgb2hsl = (require('color-convert')).rgb2hsl;
standby = true;
var mins=5, currTime;



console.log('Connecting png stream ...');
var pngStream = client.getPngStream();



pngStream .on('error', console.log) .on('data', function(buffer) {

    client.takeoff();
    client.hover();
    currTime= mins * 60;
    while (currTime > 0)
     {
     standby=true;
    lastPng = buffer;

    var data, h, hsl, i, img, l, matches, s, _i, _ref;
    img = new Image;
    img.src = buffer;
    ctx.drawImage(img, 0, 0, 440, 270);
    data = ctx.getImageData(0, 0, img.width / 4, img.height / 4).data;
    matches = 0;
    for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
      hsl = rgb2hsl(data[i], data[i + 1], data[i + 2]);
      h = hsl[0];
      s = hsl[1];
      l = hsl[2];
      if ((h < 15 || h > (360 - 15)) && s > 30 && l > 25 && l < 150) {
        matches++;
      }
    }
    if (matches > 300 && standby==true ) {
      standby = false;
      arDrone.animateLeds('blinkRed', 5, 2);
      arDrone.front(0.3);
       this.forward(1);
       this.hover();
       standby=false;
    }
      else
       {
        this.clockwise();
       }
   currTime--;
  }
   client.stop();
   client.land();
  
  });

var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
 
});
