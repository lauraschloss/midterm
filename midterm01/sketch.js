var threshold = 128;
var howwide = 16;
var howtall = 16;
var img = new Array(2); // this is gonna store two images
var whichimage = 0;

var pulse_c = new Array(howwide);
var pulse_r = new Array(howtall);

function setup() {
  createCanvas(600, 600);
  img[0] = createImage(howwide, howtall);
  img[1] = createImage(howwide, howtall);
  noSmooth(); // don't smooth anything
  randomize();
  
  for(var i = 0;i<pulse_c.length;i++)
  {
    pulse_c[i] = new p5.Pulse();
    pulse_c[i].amp(.4);
    pulse_c[i].freq(i*200+200);
    pulse_c[i].start();
  }
  for(var i = 0;i<pulse_r.length;i++)
  {
    pulse_r[i] = new p5.Pulse();
    pulse_r[i].amp(0.4);
    pulse_r[i].freq(i*250+250);
    pulse_r[i].start();
  }
}

function draw() {
  
  for(var i = 0;i<pulse_c.length;i++)
  {
    pulse_c[i].amp(0);
  }
  for(var i = 0;i<pulse_r.length;i++)
  {
    pulse_r[i].amp(0);
  }
  
  background(0, 0, 0);
  fill(255, 0, 0);
  img[whichimage].loadPixels(); // load pixels into memory
  img[1-whichimage].loadPixels(); // load pixels into memory
  for (var i = 0; i < howwide; i++) {
    for (var j = 0; j < howtall; j++) {
      // read pixels from source image...
      // everything is b&w, so the red (array index 0) channel is fine:
      var upperleft = img[whichimage].get(i-1, j-1)[0]>threshold; // upper left
      var upper = img[whichimage].get(i, j-1)[0]>threshold; // upper mid
      var upperright = img[whichimage].get(i+1, j-1)[0]>threshold; // upper right
      var left = img[whichimage].get(i-1, j)[0]>threshold; // left
      var center = img[whichimage].get(i, j)[0]>threshold; // center pixel
      var right = img[whichimage].get(i+1, j)[0]>threshold; // right
      var lowerleft = img[whichimage].get(i-1, j+1)[0]>threshold; // lower left
      var lower = img[whichimage].get(i, j+1)[0]>threshold; // lower mid
      var lowerright = img[whichimage].get(i+1, j+1)[0]>threshold; // lower right
      var neighbors = upperleft+upper+upperright+left+right+lowerleft+lower+lowerright; // how many neighbors are alive?
      var result;
      
      // THESE ARE THE RULES FOR THE SIMULATION - 
      // by default, an alive cell stays alive if it has 2 or 3 live neighbors.
      // a dead cell becomes alive if it has three live neighbors.
      if(center==1) // center pixel is alive
      {
        // if two or three live neighbors, keep alive; otherwise die.
        if(neighbors==2 || neighbors==3) result = 1; else result = 0;
      }
      else // center pixel is DEAD
      {
        // if exactly three live neighbors, become alive; otherwise stay dead.
        if(neighbors==3) {
            result = 1; 
            pulse_c[i].amp(0.3);
            pulse_r[j].amp(0.3);
            ellipse(i/howwide*width, j/howtall*height, 20, 20);
            
          }
          else {
            result = 0;
            pulse_c[i].amp(0);
            pulse_r[j].amp(0);
            line(i/howwide*width, j/howtall*height, 20, 20)
          }
      }
     // write pixels into destination image, scaled to 0 or 255:
      img[1-whichimage].set(i, j, color(result*255)); 
    }
  }
  img[1-whichimage].updatePixels(); // update pixels on destination

  whichimage = 1-whichimage; // flip source and destination
  // uncomment this thing to show the real deal:
  //image(img[whichimage], 0, 0, width, height); // draw the new source
}

function mouseClicked()
{
  fillatmouse();
}

function mouseDragged()
{
  fillatmouse();
}

function keyReleased() // blow out the image with new stuff
{
  randomize();
}

// this completely recreates the simulation with binary noise (cells are on or off)
function randomize()
{
  var randthresh = 8; // 80% of pixels will be dead.
  img[whichimage].loadPixels(); // load pixels into memory
  img[1-whichimage].loadPixels(); // load pixels into memory
  for (var i = 0; i < img[whichimage].width; i++) {
    for (var j = 0; j < img[whichimage].height; j++) {
      var r = random(10)>randthresh; // true or false?
      var thecolor = color(r*255);
      img[whichimage].set(i, j, thecolor, thecolor);
      img[1-whichimage].set(i, j, thecolor, thecolor);
    }
  }
  img[whichimage].updatePixels(); // update pixels
  img[1-whichimage].updatePixels(); // update pixels

}

// set a pixel at the mouse position to ON
function fillatmouse()
{
  img[whichimage].loadPixels();
  var thex = floor(mouseX/(width/howwide));
  var they = floor(mouseY/(height/howtall));
  img[whichimage].set(thex, they, color(255));
  img[whichimage].updatePixels();
}