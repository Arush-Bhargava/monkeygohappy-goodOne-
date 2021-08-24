const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var myEngine, myWorld;
var backImage, backgr;
var player, player_running, playerStop;
var ground, ground_img;
var bananaImg, obstaclesImg;
var obstaclesGroup, foodGroup;
var score;
var restart, restartImg;

var END = 0;
var PLAY = 1;
var gameState = PLAY;

function preload() {
  backImage = loadImage("jungle.jpg");
  player_running = loadAnimation(
    "Monkey_01.png",
    "Monkey_02.png",
    "Monkey_03.png",
    "Monkey_04.png",
    "Monkey_05.png",
    "Monkey_06.png",
    "Monkey_07.png",
    "Monkey_08.png",
    "Monkey_09.png",
    "Monkey_10.png"
  );
  bananaImg = loadImage("banana.png");
  obstaclesImg = loadImage("stone.png");
  playerStop = loadImage("monkey_01.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  myEngine = Engine.create();
  myWorld = myEngine.world;

  backgr = createSprite(0, 0, 800, 400);
  backgr.addImage(backImage);
  backgr.scale = 3;
  backgr.x = backgr.width / 2;
  backgr.velocityX = -4;

  player = createSprite(100, windowHeight - 65, 20, 50);
  player.addAnimation("running", player_running);
  player.scale = 0.15;

  ground = createSprite(windowWidth / 2, windowHeight - 60, windowWidth, 10);
  ground.x = ground.width / 2;
  ground.visible = false;

  restart = createSprite(windowWidth / 2, windowHeight / 2 + 60, 200, 60);
  restart.addImage(restartImg);

  score = 0;

  foodGroup = new Group();
  obstaclesGroup = new Group();
}

function draw() {
  Engine.update(myEngine);
  background(0);

  if (gameState === PLAY) {
    spawnObstacles();
    spawnFruits();

    drawSprites();

    if (backgr.x < 100) {
      backgr.x = backgr.width / 2;
    }

    if (keyDown("space") && player.y >= windowHeight - 125 - score) {
      player.velocityY = -12;
    }

    player.velocityY = player.velocityY + 0.52;
    player.collide(ground);

    restart.visible = false;

    if (foodGroup.isTouching(player)) {
      foodGroup[0].destroy();
      score = score + 2;
      player.scale += 0.01;
    }

    if (obstaclesGroup.isTouching(player)) {
      gameState = END;
      foodGroup.destroyEach();
      obstaclesGroup.destroyEach();
    }

    drawSprites();

    strokeWeight(4);
    fill("white");
    textSize(46);
    text("Score :  " + score, windowWidth - 250, 100);
  }

  if (gameState === END) {
    backgr.velocityX = 0;
    player.velocityX = 0;
    player.velocityY = 0;

    drawSprites();

    fill("white");
    textSize(40);
    text("Game Over", windowWidth / 2 - 100, windowHeight / 2);
    text(
      "Your Score :  " + score,
      windowWidth / 2 - 120,
      windowHeight / 2 + 40
    );
 
    restart.visible = true;
 
    if(mousePressedOver(restart)){
      gameState = PLAY;
      score = 0;
      player.scale = 0.15;

      backgr.x = backgr.width / 2;
      backgr.velocityX = -4;

    if (backgr.x < 100) {
      backgr.x = backgr.width / 2;
    }
    }
  }
}
function spawnFruits() {
  if (frameCount % 60 === 0) {
    var banana = createSprite(600, 250, 40, 10);
    banana.y = random(
      windowHeight / 2 - score * 2 + 40,
      windowHeight / 2 + 120 - score * 2
    );
    banana.addImage(bananaImg);
    banana.scale = 0.05;
    banana.velocityX = -4;

    banana.lifetime = 300;
    player.depth = banana.depth + 1;
    foodGroup.add(banana);
  }
}

function spawnObstacles() {
  if (frameCount % 80 === 0) {
    var obstacles = createSprite(windowWidth / 2, windowHeight - 115, 20, 20);
    obstacles.addImage(obstaclesImg);
    obstacles.scale = 0.18;
    obstacles.velocityX = -6;

    obstacles.lifetime = 240;
    obstaclesGroup.add(obstacles);

    obstacles.setCollider("rectangle", 0, 0, 300, 200, 90);
  }
}
