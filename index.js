const canvas = document.getElementById("drawing");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

//object and variable declaration
var massList = new Array();
var boundList = new Array();
var go = false;
var stick = false;
var edit = true;
const gravConstBig = 1000;
const gravConstSmall =250;
const m = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
function goalMass(x,y){
  this.x = x;
  this.y = y;
  this.goal = true;
}
function Boundary(x1,y1,x2,y2){
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
}
function StationaryMass(x,y,grav,src,follow){
  this.x = x;
  this.y = y;
  this.src = src;
  this.grav = grav;
  this.follow = follow;
}
function MovingMass(x,y,xvel,yvel,xaccel,yaccel){
  this.x = x;
  this.y = y;
  this.xvel = xvel;
  this.yvel = yvel;
  this.xaccel = xaccel;
  this.yaccel = yaccel;
}
//event listeners
document.addEventListener("keydown", function (event){
  if(event.key=="Enter"){
    edit = false;
    if(!go)go=true;
    else{go=false;}
    console.log(go);
  }
});

document.addEventListener("click", function(event){
  for(var i = 0; i<massList.length && edit; i++){
    if(massList[i].hasOwnProperty("follow") && m.x>massList[i].x-20 && m.x<massList[i].x+20 && m.y>massList[i].y-20 && m.y<massList[i].y+20){
      if(!massList[i].follow){
        massList[i].follow = true;
        console.log("follow " +massList[i].follow);
      }else{
        massList[i].follow = false;
      }
    }
  }
});
window.onmousemove = function(e){
  m.x = e.clientX;
  m.y = e.clientY;
}
//functions
function drawMass(x,y,gravConst){
  if(gravConst==gravConstBig)ctx.fillStyle = "#2B2D2F";
  if(gravConst==gravConstSmall)ctx.fillStyle = "#a9a9a9";
  if(gravConst==null)ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2*Math.PI, false);
  ctx.fill();
  ctx.restore();
}
function drawImage(x,y,src){
  var image = new Image();
  image.src = src;
  ctx.drawImage(image,x-35,y-130,80,150);
  ctx.restore();
}
function drawBoundary(x1,y1,x2,y2){
  ctx.fillStyle = "#000000";
  ctx.fillRect(x1,y1,x2-x1,y2-y1);
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
  go = false;
  edit = true;
  GOAL = new goalMass(500,500);
  STM = new StationaryMass(200,200,gravConstBig,null,false);
  STM2 = new StationaryMass(400,130,gravConstSmall,null,false);
  STM3 = new StationaryMass(200,300,gravConstSmall,null,false);
  WALL = new Boundary(400,350,700,370);
  MTM = new MovingMass(600,250,0,0,0,0);

  boundList.push(WALL);
  massList.push(GOAL);
  massList.push(STM3);
  massList.push(STM2);
  massList.push(STM);
  massList.push(MTM);
  alert("Hello! Welcome to my gravitational field simulation. This program was created to demonstrate the workings of a gravitational field. The grey masses are stationary and will produce a gravitational field. The darker grey represents a heavier mass and will produce a larger gravitational field. press ENTER to start the engine"); 
  window.requestAnimationFrame(loop);
}

function loop(){                //main game loop
  var ctx = document.getElementById('drawing').getContext('2d');
  ctx.clearRect(0, 0, 3000, 3000); // clear canvas
  //drawing objects
  for(var i = 0; i<massList.length; i++){
    if(!massList[i].hasOwnProperty("src")||(massList[i].src==null)){
      if(massList[i].hasOwnProperty("grav"))drawMass(massList[i].x,massList[i].y,massList[i].grav);
      else{drawMass(massList[i].x,massList[i].y,null);}
    }
    if(massList[i].hasOwnProperty("src")&&massList[i].src!=null){
      drawImage(massList[i].x,massList[i].y,massList[i].src);
    }
    if(!massList[i].hasOwnProperty("grav") && !massList[i].hasOwnProperty("xaccel")){
      drawImage(massList[i].x,massList[i].y,"");
    }
  } 
  for(var i = 0; i<boundList.length; i++){
    drawBoundary(boundList[i].x1,boundList[i].y1,boundList[i].x2,boundList[i].y2);
  }
  //computing physics
  for(var i = 0; i<massList.length && go; i++){
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
        if(i!=j && massList[j].hasOwnProperty("grav")){
          massList[i].xaccel+=xcomp(x1,y1,x2,y2,gravAccel(distance(x1,y1,x2,y2),massList[j].grav));
          massList[i].yaccel+=ycomp(x1,y1,x2,y2,gravAccel(distance(x1,y1,x2,y2),massList[j].grav));
          //kind of elastic collisions between masses
          if(distance(x1,y1,x2,y2)<=42){
            xvel = massList[i].xvel;
            yvel = massList[i].yvel;

            /* tilted axis check method 
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
            */

            //bearing check method
             
            //1. find bearings of moving mass in canvas axis
            var bearing = Math.atan2(yvel,xvel); 
            if(distance(x1,y1,x2,y2)<distance(x1+xvel,y1+yvel,x2,y2)){    //checking if collision makes sense
              console.log("----------------------------"); 
              console.log("angle of collision "+angle);
              console.log("difference in x "+(x1-x2));
              console.log("difference in x after applying xvel "+(x1-x2+xvel));
              console.log("calculated difference in distance "+(distance(x1+xvel,y1+yvel,x2,y2)-distance(x1,y1,x2,y2)));
              console.log("velocity before "+distance(massList[i].xvel,massList[i].yvel,0,0));
              console.log(" velocity after "+distance(xvel,yvel,0,0))
              console.log(" net accel      "+distance(massList[i].xaccel, massList[i].yaccel,0,0));
              console.log("----------------------------");
              massList[i].xvel = xvel;
              massList[i].yvel = yvel;
            }
          }
          //sticking 
          if(distance(x1,y1,x2,y2)<=38 && (distance(xvel,yvel,0,0)<0.4 || distance(massList[i].xaccel,massList[i].yaccel,0,0)>8)){    //sticking from repeated non-elastic collisions
            console.log("stick!");
            stick = true;
          }

          //outer window boundaries
          if(x1<=20 || x1>=drawing.width-20){
            console.log("hitbounds");
            if(x1<=20)massList[i].x=22;
            if(x1>=drawing.width-20)massList[i].x=drawing.width-22;
            if((massList[i].xvel<=0 && x1<=20) || (massList[i].xvel>=0 && x1>=drawing.width-20)){
              massList[i].xvel=-massList[i].xvel;
              massList[i].xaccel=-massList[i].xaccel;  
            }
            console.log("hitbounds");
            if(y1<=20)massList[i].y=22;
            if(y1>=drawing.height-20)massList[i].y=drawing.height-22;
            if((massList[i].yvel<=0 && y1<=20) || (massList[i].yvel>=0 && y1>=drawing.height-20)){
              massList[i].yvel=-massList[i].yvel;  
              massList[i].yaccel=-massList[i].yaccel;
            }         
          }
        }
      }
      //checking for boundary collision
      for(var j = 0; j<boundList.length; j++){
      }
      if(!stick){
        //changing velocity based on acceleration
        massList[i].xvel+=massList[i].xaccel;
        massList[i].yvel+=massList[i].yaccel;
        //changing position based on velocity;
        massList[i].x+=massList[i].xvel;
        massList[i].y+=massList[i].yvel;
      }
    }
  } 
  window.requestAnimationFrame(loop);
}
init();
