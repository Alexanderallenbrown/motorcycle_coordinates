//sliders for control
let deltaSlider;
let deltaDisplay;
let rollSlider;
let rollDisplay;

//sliders and buttons ref https://editor.p5js.org/jhedberg/sketches/rk8ydh6s7


///motorcycle parameters

//vectors
let elam;
let erlam;

//all dims in mm
wheel_rad = 300;
a = 300;
b = 1520;
c = 200;
lam = 1.0;
steerLen = 750;


//https://p5js.org/reference/#/p5/camera see for sliders also

// let fontRegular, fontItalic, fontBold;
// function preload() {
//   fontRegular = loadFont('assets/Regular.otf');
// }

interact_offset = 150

function setup() {
  createCanvas(800, 400,WEBGL);
  camera(b/3,-1200,1500,b/2,0,0,0,0,-1);

  //slider setup
  deltaSlider = createSlider(-300, 300, 0);
  deltaSlider.position(10,height+10+interact_offset);
  rollSlider = createSlider(-300,300,0);
  rollSlider.position(10,height+50+interact_offset);

  deltaDisplay = createP()
  deltaDisplay.position(30,height+10+interact_offset)
  rollDisplay = createP()
  rollDisplay.position(40,height+60+interact_offset)

  //buttons
  button1 = createButton('Reset View');
  button1.position(200 , height+10+interact_offset);
  button1.mousePressed(button1Callback);

  button2 = createButton('Steering Top View');
  button2.position(300 , height+10+interact_offset);
  button2.mousePressed(button2Callback);

  button3 = createButton('Steering Side View');
  button3.position(435 , height+10+interact_offset);
  button3.mousePressed(button3Callback);

  button4 = createButton('Steering Front View');
  button4.position(575 , height+10+interact_offset);
  button4.mousePressed(button4Callback);

  //vectors
  elam = createVector(-cos(lam),0,sin(lam));
  erlam = createVector(sin(lam),0,cos(lam));

  //debugMode(AXES);
  //a red line points +X, a green line +Y, and a blue line +Z.'
  // textFont('Helvetica');
  // text('Helvetica', 12, 60);
}

function draw() {
  background(255);

  //get ISO coordinates
  getISO();
  orbitControl();


  //input variables
  let roll = rollSlider.value()/1000.0;
  let delta = deltaSlider.value()/1000.0;
  //print to slider labels:
  deltaDisplay.html('steer: '+str(delta)+' rad')
  rollDisplay.html('roll: '+str(roll)+' rad')

  //roll the motorcycle
  push()
  rotateX(-roll)
  //now draw rear wheel, contact point
  push()
  stroke(0)
  sphere(15)
  stroke(0);
  strokeWeight(5)
  line(0,0,0,b+c,0,0)
  translate(0,0,wheel_rad)
  rotateX(PI/2)
  //torus(wheel_rad)
  noFill()
  stroke(0)
  strokeWeight(5)
  ellipse(0,0,2*wheel_rad,2*wheel_rad,50)
  pop()

  //draw front wheel/steer
  push()
  noFill();
  stroke(0);
  strokeWeight(5);
  //translate to front contact point
  translate(b+c,0,0);

  //draw steer axis, handlebars
  push()
  steerLen = 1000
  line(0,0,0,-cos(lam)*steerLen,0,sin(lam)*steerLen)
  translate(-cos(lam)*steerLen,0,sin(lam)*steerLen);
  rotate(-delta,elam);
  line(0,-150,0,0,150,0)
  pop()

  //draw sphere at axis intersection point
  sphere(10);

  //front wheel
  push();
  //rotate by steer angle
  rotate(-delta,elam);
  translate(-c,0,wheel_rad);
  rotateX(PI/2);
  ellipse(0,0,2*wheel_rad,2*wheel_rad,50);
  pop()

  //tire contact point
  push()
  stroke(100)
  rotateZ(-delta*sin(lam))
  line(0,0,0,-c,0,0)
  translate(-c,0,0);
  stroke(0)
  sphere(10)
  pop()

  push()
  rotate(-delta,elam)
  translate(-c,0,0)
  //also draw rlam point
  rlam = c*sin(lam)
  r2lam = c*sqrt(1-cos(lam)*cos(lam))
  stroke(100)
  line(0,0,0,r2lam*sin(lam),0,r2lam*(cos(lam)))

  pop()



  // pop()

  //pop out of motorcycle coords
  pop()


}

function getISO(){
  push();
  rotateX(-PI/2);
  drawGroundPlane(1.5*b,20,b/2,0,0)
  drawAxes(200)
}

function drawAxes(size,xOff,yOff,zOff){
  // push()
  strokeWeight(15)
  stroke(255,0,0)
  line(0,0,0,size,0,0)
  // strokeWeight(5);
  // line(0,0,0,b+c,0,0)
  //push()
  // translate(size,0,0)
  // text("x")
  pop()
  push()
  strokeWeight(15)
  stroke(0,255,0)
  line(0,0,0,0,-size,0)
  //push()
  //translate(size,0,0)
  // text("y")
  stroke(0,0,255)
  line(0,0,0,0,0,size)
  pop()
}

function drawGroundPlane(size,numDivs,xOff,yOff,zOff) {
  push();
  noFill();
  stroke(100);
  const spacing = size / numDivs;
  const halfSize = size / 2;
    // Lines along X axis
    for (let q = 0; q <= numDivs; q++) {
      beginShape(this.LINES);
      vertex(-halfSize + xOff, yOff, q * spacing - halfSize + zOff);
      vertex(+halfSize + xOff, yOff, q * spacing - halfSize + zOff);
      endShape();
    }

    // Lines along Z axis
    for (let i = 0; i <= numDivs; i++) {
      beginShape(this.LINES);
      vertex(i * spacing - halfSize + xOff, yOff, -halfSize + zOff);
      vertex(i * spacing - halfSize + xOff, yOff, +halfSize + zOff);
      endShape();
    }

    pop();
  };


function button1Callback(){
  // getISO()
  camera(b/3,-1200,1500,b/2,0,0,0,0,-1);
  orbitControl();
}

function button2Callback(){
  // getISO()
  camera(b,0,1500,b,0,0,0,-1,0);
  orbitControl();
}


function button3Callback(){
  // getISO()
  camera(b,-1200,0,b,0,0,0,0,-1);
  orbitControl();
}


function button4Callback(){
  // getISO()
  camera(b+1200,0,0,b,0,0,0,0,-1);
  orbitControl();
}
