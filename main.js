/*created by prashant shukla */
var paddle2 =10,paddle1=10;

var paddle1X = 10,paddle1Height = 110;
var paddle2Y = 685,paddle2Height = 70;

var score1 = 0, score2 =0;
var paddle1Y;

var  playerscore =0;
var audio1;
var pcscore =0;
//ball x and y and speedx speed y and radius
var ball = {
    x:350/2,
    y:480/2,
    r:20,
    dx:3,
    dy:3
}
Right_X = 0;
Right_Y = 0;
Pose_Net = "";
RightWrist_Score = "";
var Game_Status = "";
var BallPadel_Sound = "";
var Missed_Sound = "";

function preload(){
  BallPadel_Sound = loadSound("ball_touch_paddel.wav");
  Missed_Sound = loadSound("missed.wav");
}

function setup(){
  var canvas =  createCanvas(700,600);
  canvas.parent('Canvas');
  Video = createCapture(VIDEO);
  Video.size(700, 600);
  Video.hide();
  Pose_Net = ml5.poseNet(Video, Model_Loaded)
}

function Model_Loaded(){
  console.log("Model Loaded!");
  Pose_Net.on('pose', Got_Poses);
}

function Got_Poses(results){
  if(results.length > 0){
    console.log(results);
    Right_X = results[0].pose.rightWrist.x;
    Right_Y = results[0].pose.rightWrist.y;
    RightWrist_Score = results[0].pose.keypoints[10].score;
    console.log("Right Wrist X: " + Right_X + "Right Wrist Y: " + Right_Y);
  }
}

function Start_Game(){
  Game_Status = "Start";
  document.getElementById("Game-Status").innerHTML = "Game Status: Playing";
}

function Restart(){
  pcscore = 0;
  playerscore = 0;
  loop();
}

function draw(){
  if(Game_Status == "Start")
  {
 background(0); 
image(Video, 0, 0, 700, 600);
 fill("black");
 stroke("black");
 rect(680,0,20,700);

 fill("black");
 stroke("black");
if(RightWrist_Score > 0.2){
  fill("#1500ff");
  stroke("#1500ff");
  circle(Right_X, Right_Y, 20);
}
   //funtion paddleInCanvas call 
   paddleInCanvas();
 
   //left paddle
   fill(250,0,0);
    stroke(0,0,250);
    strokeWeight(0.5);
   paddle1Y = Right_Y; 
   rect(paddle1X,paddle1Y,paddle1,paddle1Height,100);
   
   
    //pc computer paddle
    fill("#FFA500");
    stroke("#FFA500");
   var paddle2y =ball.y-paddle2Height/2;  rect(paddle2Y,paddle2y,paddle2,paddle2Height,100);
    
    //function midline call
    midline();
    
    //funtion drawScore call 
   drawScore();
   
   //function models call  
   models();
   
   //function move call which in very important
    move();
}
}



//function reset when ball does notcame in the contact of padde
function reset(){
   ball.x = width/2+100,
   ball.y = height/2+100;
   ball.dx=3;
   ball.dy =3;
}


//function midline draw a line in center
function midline(){
    for(i=0;i<480;i+=10) {
    var y = 0;
    fill("white");
    stroke(0);
    rect(width/2,y+i,10,480);
    }
}


//function drawScore show scores
function drawScore(){
    textAlign(CENTER);
    textSize(20);
    fill("red");
    stroke(250,0,0)
    text("Player:",100,50)
    text(playerscore,140,50);
    text("Computer:",500,50)
    text(pcscore,555,50)
}


//very important function of this game
function move(){
   fill(50,350,0);
   stroke(255,0,0);
   strokeWeight(0.5);
   ellipse(ball.x,ball.y,ball.r,20)
   ball.x = ball.x + ball.dx;
   ball.y = ball.y + ball.dy;
   if(ball.x+ball.r>width-ball.r/2){
       ball.dx=-ball.dx-0.5;       
   }
  if (ball.x-2.5*ball.r/2< 0){
  if (ball.y >= paddle1Y && ball.y <= paddle1Y + paddle1Height) {
    ball.dx = -ball.dx+0.5;
    BallPadel_Sound.play(); 
  }
  else{
    pcscore++;
    reset();
    navigator.vibrate(100);
  }
}
if(pcscore ==4){
    fill("#FFA500");
    stroke(0)
    rect(0,0,width,height-1);
    fill("white");
    stroke("white");
    textSize(25)
    text("Game Over!",width/2,height/2);
    text("Should We Play Again?",width/2,height/2+30)
    noLoop();
    pcscore = 0;
}
   if(ball.y+ball.r > height || ball.y-ball.r <0){
       ball.dy =- ball.dy;
   }   
}


//width height of canvas speed of ball 
function models(){
    textSize(18);
    fill(255, 0, 0);
    stroke(255);
    text("Width:"+width,135,15);
    text("Speed:"+abs(ball.dx),50,15);
    text("Height:"+height,235,15)
}


//this function help to not go te paddle out of canvas
function paddleInCanvas(){
  if(mouseY+paddle1Height > height){
    mouseY=height-paddle1Height;
  }
  if(mouseY < 0){
    mouseY =0;
  }  
}
