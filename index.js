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
  if(grav==1000)this.size = 50;
  if(grav==250)this.size = 20;
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
    if(massList[i].hasOwnProperty("follow") && m.x>massList[i].x-massList[i].size && m.x<massList[i].x+massList[i].size && m.y>massList[i].y-massList[i].size && m.y<massList[i].y+massList[i].size){
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
function corAng(angle){
  var rad = angle%(Math.PI*2);    //correcting for full rotations
  if(rad<0){                      //removing negative
    rad = (2*Math.PI)+rad;
  }
  return rad;
}
function deg(rad){
  return (360*rad)/(Math.PI*2);
}
function drawMass(x,y,gravConst,size){
  if(gravConst==gravConstBig)ctx.fillStyle = "#2B2D2F";
  if(gravConst==gravConstSmall)ctx.fillStyle = "#a9a9a9";
  if(gravConst==null)ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2*Math.PI, false);
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
  return Math.abs(Math.sqrt(sumpow));
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
  alert("Hello! Welcome to my gravitational field simulation. This program was created to demonstrate the workings of a gravitational field. The grey masses are stationary and will produce a gravitational field. The darker grey represents a heavier mass and will produce a larger gravitational field. TRY TO GET THE RED BALL TO ENTER THE GOAL. CLICK THE STATIONARY MASSES TO MOVE THEM. press ENTER to start the engine"); 
  window.requestAnimationFrame(loop);
}

function loop(){                //main game loop
  var ctx = document.getElementById('drawing').getContext('2d');
  ctx.clearRect(0, 0, 3000, 3000); // clear canvas

  var winx = 0;
  var winy = 0;
  //drawing objects
  for(var i = 0; i<massList.length; i++){
    if(massList[i].follow){
      massList[i].x = m.x;
      massList[i].y = m.y;
    }
    if(!massList[i].hasOwnProperty("src")||(massList[i].src==null)){
      if(massList[i].hasOwnProperty("grav"))drawMass(massList[i].x,massList[i].y,massList[i].grav,massList[i].size);
      else{drawMass(massList[i].x,massList[i].y,null,20);}
    }
    if(massList[i].hasOwnProperty("src")&&massList[i].src!=null){
      drawImage(massList[i].x,massList[i].y,massList[i].src);
    }
    if(!massList[i].hasOwnProperty("grav") && !massList[i].hasOwnProperty("xaccel")){
      drawImage(massList[i].x,massList[i].y,"https://image.flaticon.com/icons/png/512/777/777999.png");
      winx = massList[i].x;
      winy = massList[i].y;
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
      //checking for win
      var winCheck = 15+distance(massList[i].xvel,massList[i].yvel,0,0);
      if(x1>=winx-winCheck && x1<=winx+winCheck && y1>=winy-winCheck && y1<=winy+winCheck){
        alert("you won!")
        go = false;
        break;
      }
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
          if(distance(x1,y1,x2,y2)<=(massList[j].size+20)){
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
            var bearing = 0;
            if(xvel>0 && yvel<0)bearing = Math.atan2(Math.abs(yvel),xvel);
            if(xvel<0 && yvel<0)bearing = Math.PI-Math.atan2(Math.abs(yvel),Math.abs(xvel));
            if(xvel<0 && yvel>0)bearing = Math.atan2(yvel,Math.abs(xvel))+Math.PI;
            if(xvel>0 && yvel>0)bearing = (2*Math.PI)-Math.atan2(yvel,xvel) ;
            if(xvel>0 && yvel==0)bearing = 0;
            if(xvel==0 && yvel<0)bearing = Math.PI/2;
            if(xvel<0 && yvel==0)bearing = Math.PI;
            if(xvel==0 && yvel>0)bearing = (3*Math.PI)/2;
            var collisionAngle = corAng(Math.atan2(y1-y2,x2-x1));
            var resultantAngle = corAng((collisionAngle-(bearing-collisionAngle))+Math.PI); 
            //2. find the magnitude of the velocity vector
            var velMag = distance(xvel,yvel,0,0);

            //3. calculating the acute angle and determining resultant xvel and yvel
            var acuteAngle = resultantAngle;
            if(resultantAngle<Math.PI/2){                                     //quad 1
              xvel = velMag*Math.cos(acuteAngle);
              yvel = -velMag*Math.sin(acuteAngle);
            }
            if(resultantAngle<Math.PI && resultantAngle>(Math.PI/2)){         //quad 2
              acuteAngle = Math.PI-resultantAngle;
              
              xvel = -velMag*Math.cos(acuteAngle);
              yvel = -velMag*Math.sin(acuteAngle);
            }
            if(resultantAngle<(3*Math.PI)/2 && resultantAngle>Math.PI){       //quad 3
              acuteAngle = resultantAngle-Math.PI;

              xvel = -velMag*Math.cos(acuteAngle);
              yvel = velMag*Math.sin(acuteAngle);
            }
            if(resultantAngle<(2*Math.PI) && resultantAngle>(3*Math.PI)/2){   //quad 4
              acuteAngle = (2*Math.PI)-resultantAngle;

              xvel = velMag*Math.cos(acuteAngle);
              yvel = velMag*Math.sin(acuteAngle);
            }
            //other cases
            if(resultantAngle==0){
              xvel = velMag;
              yvel = 0;
            }
            if(resultantAngle==Math.PI/2){
              xvel = 0;
              yvel = -velMag;
            }
            if(resultantAngle==Math.PI){
              xvel = -velMag;
              yvel = 0;
            }
            if(resultantAngle==(3*Math.pi)/2){
              xvel = 0;
              yvel = velMag;
            }
            if(distance(x1,y1,x2,y2)<distance(x1+xvel,y1+yvel,x2,y2)){    //checking if collision makes sense
              massList[i].xvel = xvel;
              massList[i].yvel = yvel;

              console.log("----------------collision----------------"); 
              console.log("       bearing of velocity vector "+deg(bearing));
              console.log(" collision angle from moving mass "+deg(collisionAngle));
              console.log("                  resultant angle "+deg(resultantAngle));
              console.log("                  distance beween "+distance(x1,y1,x2,y2));
              console.log("calculated difference in distance "+(distance(x1+xvel,y1+yvel,x2,y2)-distance(x1,y1,x2,y2)));
              console.log(" net accel      "+distance(massList[i].xaccel, massList[i].yaccel,0,0));
              console.log("-----------------------------------------");
            }
          }
          //sticking 
          if(distance(x1,y1,x2,y2)<=(massList[j].size+18) && (distance(xvel,yvel,0,0)<0.4 || distance(massList[i].xaccel,massList[i].yaccel,0,0)>8)){    //sticking from repeated non-elastic collisions
            console.log("stick!");
            stick = true;
          }
        }
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
      //checking for boundary collision
      for(var j = 0; j<boundList.length; j++){
        var x = massList[i].x;
        var y = massList[i].y;
        var bx1 = boundList[j].x1;
        var bx2 = boundList[j].x2;
        var by1 = boundList[j].y1;
        var by2 = boundList[j].y2;
        if(((x>=bx1-20 && x<bx1)||(x<=bx2+20 && x>bx2)) && y>=by1-10 && y<=by2+10){
          console.log("boundary collision x");
          massList[i].xvel = -massList[i].xvel;
        }
        if(((y>=by1-20 && y<by1)||(y<=by2+20 && y>by2)) && x>=bx1-10 && x<=bx2+10){
          console.log("boundary collision y");
          massList[i].yvel = -massList[i].yvel;
        }
        //sticking boundary collision
          //to be written 
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
