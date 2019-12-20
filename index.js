const canvas = document.getElementById("drawing");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")
ctx.font = "30px Arial";

//object and variable declaration
var massList = new Array();
const gravConstBig = 1000;
const gravConstSmall =250;

function StationaryMass(x,y,grav,src){
  this.x = x;
  this.y = y;
  this.src = src;
  this.grav = grav;
}
function MovingMass(x,y,xvel,yvel,xaccel,yaccel){
  this.x = x;
  this.y = y;
  this.xvel = xvel;
  this.yvel = yvel;
  this.xaccel = xaccel;
  this.yaccel = yaccel;
}
//key event listeners
document.addEventListener("keydown", function (event){
  if(event.key=="ArrowLeft"){
  }
  if(event.key=="ArrowRight"){
  }
  if(event.key=="ArrowUp"){
    alert('up key pressed');
  }
});

//functions
function drawMass(x,y){
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2*Math.PI, false);
  ctx.fill();
  ctx.restore();
}
function drawImage(x,y,src){
  var image = new Image();
  image.src = src;
  ctx.drawImage(image,x-65,y-65,130,130);
  ctx.restore();
}
function distance(x1,y1,x2,y2){
  diffx = x2-x1;
  diffy = y2-y1;
  var sumpow = Math.pow(diffx,2)+Math.pow(diffy,2);
  return Math.sqrt(sumpow);
}
function gravAccel(r,gravConst){        //r is the distance between the two masses
  var mag=(gravConst/Math.pow(r,2));
  if(r<0)return -mag;
  if(r>=0)return mag;
}
function xcomp(x1,y1,x2,y2,val){
  var angle = Math.atan2(Math.abs(y2-y1),Math.abs(x2-x1));
  var magnitude = (val*Math.cos(angle));
  if(x1>x2)return -magnitude;
  if(x2>=x1)return magnitude;
}

function ycomp(x1,y1,x2,y2,val){
  var angle = Math.atan2(Math.abs(y2-y1),Math.abs(x2-x1));
  var magnitude = (val*Math.sin(angle));
  if(y1>y2)return -magnitude;
  if(y2>=y1)return magnitude;
}
//initializing function
function init(){
  STM = new StationaryMass(200,200,gravConstBig,null);
  STM2 = new StationaryMass(400,130,gravConstSmall,null);
  MTM = new MovingMass(600,250,0,0,0,0);
  
  massList.push(STM2);
  massList.push(STM);
  massList.push(MTM);
  
  window.requestAnimationFrame(loop);
}

function loop(){                //main game loop
  var ctx = document.getElementById('drawing').getContext('2d');
  ctx.clearRect(0, 0, 3000, 3000); // clear canvas
  //drawing objects
  for(var i = 0; i<massList.length; i++){
    if(!massList[i].hasOwnProperty("src")||massList[i].src==null){
      drawMass(massList[i].x,massList[i].y);
    }
    if(massList[i].hasOwnProperty("src")&&massList[i].src!=null){
      drawImage(massList[i].x,massList[i].y,massList[i].src);
    }
  } 

  //computing physics
  for(var i = 0; i<massList.length; i++){
    //initializing variables
    var x1 = massList[i].x;
    var y1 = massList[i].y;
    if(massList[i].hasOwnProperty("xaccel")){
      //calculating forces on objects
      //resetting accel values
      massList[i].xaccel = 0;
      massList[i].yaccel = 0;
      for(var j = 0; j<massList.length; j++){
        //initializing variables
        var x2 = massList[j].x;
        var y2 = massList[j].y;
        if(i!=j){
          massList[i].xaccel+=xcomp(x1,y1,x2,y2,gravAccel(distance(x1,y1,x2,y2),massList[j].grav));
          massList[i].yaccel+=ycomp(x1,y1,x2,y2,gravAccel(distance(x1,y1,x2,y2),massList[j].grav));
          //kind of elastic collisions
          if(distance(x1,y1,x2,y2)<=40){
            console.log("collision!");
            console.log(distance(x1,y1,x2,y2));
            xvel = massList[i].xvel;
            yvel = massList[i].yvel;
            var tiltxvel = 0;
            var tiltyvel = 0;
            //1. calculate tangent angle for circles and calculate tilted axis components
            var angle = Math.atan2(Math.abs(y2-y1),Math.abs(x2-x1));
            tiltxvel+=yvel*Math.cos(angle);
            tiltyvel+=yvel*Math.sin(angle);
            angle=(Math.PI/2)-angle;
            tiltxvel+=xvel*Math.cos(angle);
            tiltyvel+=xvel*Math.sin(angle);

            tiltyvel = -tiltyvel;           //2. flipping y component for tilted axis
            
            //3. calculate original axis components based off of tilted components
            xvel = 0;
            yvel = 0;
            xvel+=tiltyvel*Math.sin(angle);
            yvel+=tiltyvel*Math.cos(angle);
            xvel+=tiltxvel*Math.cos(angle);
            yvel+=tiltxvel*Math.sin(angle);

            massList[i].xvel = xvel;
            massList[i].yvel = yvel;
          }
          
          if(distance(x1,y1,x2,y2)<=34 && massList[i].xvel<1 && massList[i].yvel<1){
            massList[i].xvel=0;
            massList[i].yvel=0;
            massList[i].xaccel=0;
            massList[i].yaccel=0;
          }
        }
      }
      //changing velocity based on acceleration
      massList[i].xvel+=massList[i].xaccel;
      massList[i].yvel+=massList[i].yaccel;
      
      console.log(massList[i].xaccel);
      //changing position based on velocity;
      massList[i].x+=massList[i].xvel;
      massList[i].y+=massList[i].yvel;
    }
  } 
  window.requestAnimationFrame(loop);
}
init();
