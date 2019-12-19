const canvas = document.getElementById("drawing");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")
ctx.font = "30px Arial";

//object and variable declaration
var massList = new Array();
const gravConst = 2;

function StationaryMass(x,y,charge){
  this.x = x;
  this.y = y;
  this.charge = charge;
}
function MovingMass(x,y,xvel,yvel,xaccel,yaccel){
  this.x = x;
  this.y = y;
  this.xvel = xvel;
  this.yvel = yvel;
  this.xaccel = xaccel;
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
}
function distance(x1,y1,x2,y2){
  var diffx = x2-x1;
  var diffy = y2-y1;
  var sumpow = Math.pow(diffx,2)+Math.pow(diffy,2);
  return Math.sqrt(sumpow);
}
function gravAccel(r){        //r is the distance between the two masses
  return gravConst/Math.pow(r,2); 
}
//initializing function
function init(){
  STM = new StationaryMass(200,200,0);
  MTM = new MovingMass(400,400,0,0,0,0);

  massList.push(STM);
  massList.push(MTM);
  
  window.requestAnimationFrame(loop);
}

function loop(){                //main game loop
  //drawing objects
  drawMass(STM.x,STM.y);  
  drawMass(MTM.x,MTM.y);

  //computing physics
  for(var i = 0; i<massList.length; i++){
    if(massList[i].hasOwnProperty("xaccel")){
      //calculating forces on objects
      for(var j = 0; j<massList.length; j++){
        if(i!=j){
          var force = (distance(massList[i].x,massList[i].y,massList[j].x,massList[j].y));
          console.log(i+" force on "+j+" is "+force);
        }
      }
      //changing velocity based on acceleration
      massList[i].xvel+=massList[i].xaccel;
      massList[i].yvel+=massList[i].yaccel;
       
      //changing position based on velocity;
      massList[i].x+=massList[i].xvel;
      massList[i].y+=massList[i].yvel;
    }
  } 
  window.requestAnimationFrame(loop);
}
init();
