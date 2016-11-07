// SPIROGRAPH
// http://en.wikipedia.org/wiki/Spirograph
// also (for inspiration):
// http://ensign.editme.com/t43dances
//
// this p5 sketch uses simple transformations to create a
// Spirograph-like effect with interlocking circles (called sines).  
// press the spacebar to switch between tracing and
// showing the underlying geometry.
//
// your tasks:
// (1) tweak the code to change the simulation so that it draws something you like.
// hint: you can change the underlying system, the way it gets traced when you hit the space bar,
// or both.  try to change *both*.  :)
// (2) use p5.sound or tone.js to make the simulation MAKE SOUND.
// hint: the websites for p5.sound and tone.js have lots of examples.
// try and adapt them.
// another hint: javascript isn't super efficient with a large number of audio playing at once.
// see if there's a simple way to get an effective sound, or limit the number of shapes
// you're working with.

var NUMSINES = 5; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var rad; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 0.05; // the speed of the central sine
var ratio = 0.4; // what multiplier for speed is each additional sine?
var a = 50; // how opaque is the tracing system

var trace = false; // are we tracing?

var osc = new Array(NUMSINES);
var reverb;

function setup()
{
  createCanvas(800, 600); // OpenGL mode

  rad = height/4; // compute radius for central circle
  background(255); // clear the screen

  for (i = 0; i<sines.length; i++)
  {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }
  
  reverb = new p5.Reverb();
  reverb.set(5, 20); // something and something else
  for(i = 0;i<osc.length;i++)
  {
    osc[i] = new p5.Oscillator();
    osc[i].setType('sine');
    osc[i].freq(200+i*200);
    osc[i].amp(4);
    osc[i].start();
    osc[i].disconnect();
    osc[i].connect(reverb);
  }
  
}

function draw()
{
  if (!trace) {
    background(255); // clear screen if showing geometry
    stroke(0, 255); // black pen
    //noFill(); // don't fill
  } 

  // MAIN ACTION
  push(); // start a transformation matrix
  translate(width/2, height/2); // move to middle of screen

  for (i = 0; i<sines.length; i++) // go through all the sines
  {
    var erad = 0; // radius for small "point" within circle... this is the 'pen' when tracing
    // setup for tracing
    if (trace) {
      stroke(0, 100, 255*(float(i)/sines.length), 100); // blue
      fill(0, 0, 255, a/2); // also, um, blue
      erad = 8.0*(1.0-float(i)/sines.length); // pen width will be related to which sine
    }
    var radius = rad/(i+1); // radius for circle itself
    rotate(sines[i]); // rotate circle
    if (!trace) line(0, 0, radius*2, radius*2); // if we're simulating, draw the sine
    push(); // go up one level
    translate(0, radius); // move to sine edge
    //if (!trace) rect(0, 0, 5, 5); // draw a little circle
    if (trace) line(0, 0, erad, erad); // draw with erad if tracing
    pop(); // go down one level
    translate(0, radius); // move into position for next sine
    osc[i].freq(sines[i]/TWO_PI*1000.);
    sines[i] = (sines[i]+(fund+(fund*i*ratio)))%TWO_PI; // update angle based on fundamental
  }
  
  pop(); // pop down final transformation

  
}

function keyReleased()
{
  if (key==' ') {
    trace = !trace; 
    background(255);
  }
}
