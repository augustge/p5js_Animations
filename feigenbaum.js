


var figure;
var x0 = 0.1;

var SLIDERTEXTS = [];
var SLIDERS     = [];

function setup(){
  createCanvas(windowWidth,windowHeight);

  c1 = color("#2F343B");
  c2 = color("#A6793D");
  c3 = color("#FF950B");
  c4 = color("#C77966");
  c5 = color("#E3CDA4");
  c6 = color("#703030");
  c7 = color("#7E827A");
  c8 = color("#F7EFF6");
  c9 = color("#C4C4BD");
  c10= color("#56BED7");
  c11= color("#D43215");
  c12= color("#453B3D");
  c13= color("#FF0000");
  c14= color("#FF950B");

  figure = new Figure(100,width-100,100,height-100,1.0);
  figure.fillWithRandomLines(10);
  figure.update();
  makeSliders();
}



function draw(){
  background(c8);
  adjustToSlidervalues();

  translate(0,height);
  scale(1,-1);

  figure.show();

  resetMatrix();

  showControlpanel();
}


function Figure(xm,xM,ym,yM,A){
  this.xm = xm;
  this.xM = xM;
  this.ym = ym;
  this.yM = yM;
  this.A  = A;

  this.x0         = 0.5;
  this.iterations = 50;

  this.Ps    = []; //initial points of lines
  this.LINES = [];

}

Figure.prototype.newLine = function(){
  this.line = new Line(this.x0);
}

Figure.prototype.iterateLine = function(N){
  for(var j=0; j<N; j++){
    this.line.iterate();
  }
}

Figure.prototype.update = function(){
  this.Xm = 2/PI*atan(20*this.A)-1 - 0.1 ;
  this.XM = 1 + 0.1;
  if( this.A >0 ){
    this.Ym = 0 - 0.1;
    this.YM = this.A/4.+0.1;
  }else{
    this.Ym = this.A/4. - 0.1;
    this.YM = -this.A/4/8. + 0.1;
  }
  this.updateLine();
  this.updateAllLines();
}

Figure.prototype.updateLine = function(){
  this.newLine();
  this.iterateLine(this.iterations);
}

Figure.prototype.getX = function(x){
  return map(x,this.Xm,this.XM,this.xm,this.xM);
}

Figure.prototype.getY = function(y){
  return map(y,this.Ym,this.YM,this.ym,this.yM);
}

Figure.prototype.show = function(){
  this.drawPlot(1000);
  this.showAllLines(0.5,c10);
  this.line.show(2,c13);
}

Figure.prototype.fillWithRandomLines = function(N){
  this.LINES = [];
  this.Ps    = [];
  for(var i=0; i<N; i++){
    var p = random(this.Xm,this.XM);
    this.Ps.push(p);
    var line = new Line(p);
    for(var j=0; j<this.iterations; j++){
      line.iterate();
    }
    this.LINES.push( line );
  }
}

Figure.prototype.updateAllLines = function(){
  var newLINES = [];
  for(var i=0; i<this.LINES.length; i++){
    var line = new Line(this.Ps[i]);
    var newLine = new Line(line.x0);
    for(var j=0; j<this.iterations; j++){
      newLine.iterate();
    }
    newLINES.push( newLine );
  }
  this.LINES = newLINES;
}

Figure.prototype.showAllLines = function(w,c){
  for(var k=0; k<this.LINES.length; k++){
    this.LINES[k].show(w,c);
  }
}

Figure.prototype.drawPlot = function(N){
  strokeWeight(2);
  noFill();

  // axes
  stroke(c7);
  var x0 = this.getX(0);
  var y0 = this.getY(0);
  beginShape();
  vertex(x0,this.ym);
  vertex(x0,this.yM);
  endShape();
  beginShape();
  vertex(this.xm,y0);
  vertex(this.xM,y0);
  endShape();

  // plot
  stroke(c1);
  beginShape();
  for(var i=0; i<N; i++){
    var X = map(i,0,N,this.Xm,this.XM);
    var Y = f(X,this.A);
    var x = this.getX(X);
    var y = this.getY(Y);
    vertex(x,y);
  }
  endShape();

  // straight line
  stroke(c2);
  beginShape();
  for(var i=0; i<N; i++){
    var X = map(i,0,N,this.Xm,this.XM); // map to x-val
    var x = this.getX(X); // map to pixels
    var y = this.getY(X); // map to pixels
    if(y<this.yM && y>this.ym){
      vertex(x,y);
    }
  }
  endShape();
}


function Line(x0){
  this.X   = [x0];
  this.xp  = x0;
  this.x0  = x0;
}

Line.prototype.iterate = function(){
  this.xp = f(this.xp,figure.A);
  this.X.push(this.xp);
}

Line.prototype.show = function(w,col){
  noFill();
  strokeWeight(w);
  stroke(col);
  beginShape();
  // first line
  var x  = figure.getX(this.X[0]);
  var y  = figure.getY(0);
  vertex(x,y);
  // continued
  for(var i=0; i<this.X.length; i++){
    var X   = this.X[i];
    var Y   = f(this.X[i],figure.A);
    var y   = figure.getY(Y);
    var x   = figure.getX(X);
    var xofy= figure.getX(Y);
    vertex(x,y);
    vertex(xofy,y);
  }
  endShape();
}


function f(x,A){
  return A*x*(1.0-x);
}




// ============================================================

function makeSliders(){
  SLIDERTEXTS.push("Slope");
  SLIDERS.push( createSlider(-2.0, 5.0, 1.0, 0.01).class("terminatorSlider") );
}

function adjustToSlidervalues(){
  figure.A = SLIDERS[0].value();
  figure.update();
  // figure.iterateLine(figure.iterations);
}

function showControlpanel(){
  noStroke();
  fill(0);

  // General
  var top             = 40;
  var textSep         = 20;
  var xpos            = 120;
  var sliderSep       = 50;
  var classSeparation = 170;

  textSize(16);
  for(var i=0; i<SLIDERS.length; i++){
    textAlign(RIGHT);
    text(SLIDERTEXTS[i],    xpos-textSep, top+i*sliderSep+10);
    SLIDERS[i].position(    xpos, top+i*sliderSep);
    textAlign(LEFT);
    text(SLIDERS[i].value(),xpos+0.2*width, top+i*sliderSep+10);
  }
}

// ============================================================

function mousePressed(){
  if(mouseX>figure.xm && mouseX<figure.xM){
    figure.x0 = map(mouseX,figure.xm,figure.xM,figure.Xm,figure.XM);
    figure.update();
    // figure.iterateLine(figure.iterations);
  }
}

function mouseDragged(){
  if(mouseX>figure.xm && mouseX<figure.xM){
    figure.x0 = map(mouseX,figure.xm,figure.xM,figure.Xm,figure.XM);
    figure.update();
    // figure.iterateLine(figure.iterations);
  }
}

function keyPressed(){
  if(keyCode==37){ //left
    figure.x0 -= 0.05;
  }

  if(keyCode==39){ //right
    figure.x0 += 0.05;
  }
}






//
