let maxCar = 3;
var enemyCount = [];
let points = 0;
var reqAnim;
let menu = true
let release = true;
var releaseInterval;
let enemyImageList = [
  "Ambulance.png",
  "Audi.png",
  "Black_viper.png",
  "Mini_truck.png",
  "Mini_van.png",
];

class GameContainer {
  constructor() {
    this.bgx = 0;
    this.bgy = 0;
    let gameDiv = document.getElementById("game");
    this.gameDiv = gameDiv;
    let startButton = document.getElementById('start-button');
    let gameMenu = document.getElementById('menu');
    let hsBoard = document.getElementById('high-score-board');
    this.hsBoard = hsBoard;
    this.gameMenu = gameMenu;
    this.startButton = startButton;

    gameDiv.style.margin = "0 auto";
    gameDiv.style.height = "700px";
    gameDiv.style.width = "500px";
    gameDiv.style.backgroundImage = "url('../assets/roadBackground.png') ";
    gameDiv.style.backgroundSize = "contain";
    gameDiv.style.backgroundRepeat = "repeat-y";
    gameDiv.style.backgroundPositionY = "0px";
    gameDiv.style.overflow = "hidden";
  }
  initialize() {

    document.addEventListener("keydown", function (evt) {
      if (evt.key === "a" || evt.key === "ArrowLeft") {
        playerCar.move(-1);
      } else if (evt.key === "d" || evt.key === "ArrowRight") {
        playerCar.move(1);
      }
    });
    this.startButton.addEventListener('click', () => {
      initScene()
      menu = false;
      this.gameMenu.style.display = 'none';
      this.hsBoard.style.display = 'none';
      points = 0;
    })
  }
  displayMenu() {
    this.gameMenu.style.display = 'block';
    this.hsBoard.style.display = 'block';
  }

  environment() {
    parseInt(this.gameDiv.style.backgroundPositionY) >= 1000 ?
      (this.gameDiv.style.backgroundPositionY = "0px") :
      (this.gameDiv.style.backgroundPositionY =
        parseInt(this.gameDiv.style.backgroundPositionY) + 10 + "px");
  }
  static gameOver() {
    if(points > highScore){
   localStorage.setItem("score", points) ;
    hsPoint.innerText = points;
    }
    menu = true;
    playerCar.playerCar.style.display = 'none';
    enemyCount.forEach((car, index) => {
      car.enemyCar.remove()
    })
    enemyCount = []
    clearInterval(releaseInterval)
  }
  static get_random(list) {
    return list[Math.floor(Math.random() * list.length)];
  };
}

class PlayerCar {
  constructor() {
    let playerCar = document.getElementById("player-car");
    playerCar.style.display = 'none';
    this.playerCar = playerCar;
    this.positionX = 210;
    this.positionY = 525;
    this.laneIndex = 2;
  }
  initialize() {
    this.playerCar.style.display = 'block';
    this.playerCar.style.position = "absolute";
    this.playerCar.style.top = this.positionY + "px";
    this.playerCar.style.left = this.positionX + "px";
  }
  updatePlayer() {
    if (this.laneIndex == 1) {
      this.playerCar.style.left = "45px";
    } else if (this.laneIndex == 2) {
      this.playerCar.style.left = "210px";
    } else if (this.laneIndex == 3) {
      this.playerCar.style.left = "380px";
    }
  }

  move(operation) {
    if (this.laneIndex + operation > 0 && this.laneIndex + operation < 4) {
      this.laneIndex += operation;
      this.updatePlayer();
    } else {
      this.laneIndex + operation <= 0 ?
        (this.laneIndex = 1) :
        (this.laneIndex = 3);
    }
  }

  static collision(player, opponent) {

    const rect1 = {
      x: parseInt(player.playerCar.style.left),
      y: parseInt(player.playerCar.style.top),
    };
    const rect2 = {
      x: parseInt(opponent.enemyCar.style.left),
      y: parseInt(opponent.enemyCar.style.top),
    };
    const width = 80;
    const height = 160;
    if (
      rect1.x < rect2.x + width &&
      rect1.x + width > rect2.x &&
      rect1.y < rect2.y + height &&
      rect1.y + height > rect2.y
    ) {
      GameContainer.gameOver();
    }
  }
}

class EnemyCar {
  constructor() {
    let enemies = document.getElementById("enemies");
    let enemyCar = document.createElement("div");
    enemyCar.classList.add("enemy-car");
    enemies.appendChild(enemyCar);
    this.enemyCar = enemyCar;
    this.positionY = -100;
    this.positionX = GameContainer.get_random([45, 210, 380]);
    this.laneIndex = GameContainer.get_random([1, 2, 3]);
    this.onscreen = false;
  }
  initialize() {
    this.onscreen = true;
    this.enemyCar.style.position = "absolute";
    this.enemyCar.style.top = this.positionY + "px";
    this.enemyCar.style.left = this.positionX + "px";
    let image = new Image();
    let randomEnemy = `./assets/${GameContainer.get_random(enemyImageList)}`;
    image.src = randomEnemy;
    image.width = 80;
    image.height = 160;
    image.style.transform = "rotate(180deg)";
    this.enemyCar.appendChild(image);
  }
  accelerate() {
    this.enemyCar.style.top = parseInt(this.enemyCar.style.top) + 15 + "px";
    if (parseInt(this.enemyCar.style.top) > 700) {
      this.enemyCar.remove();
      points += 1;
      enemyCount.shift();
    }
  }
}


let score = document.getElementById('score-point');
let hsPoint = document.getElementById('high-score-point');
let highScore = localStorage.getItem("score");
let gameContent = new GameContainer();
let playerCar = new PlayerCar();

gameContent.initialize();
hsPoint.innerText = highScore;

let initScene = () => {
  playerCar.initialize();
  releaseInterval = setInterval(() => {
    release ? (release = false) : (release = true);
  }, 700);
}


let loop = () => {
  reqAnim = window.requestAnimationFrame(loop);
  if (!menu) {
    let howMany = document.getElementById("enemies").childElementCount;
    score.innerText = points;
    if (howMany < maxCar) {
      for (var i = 0; i < maxCar - enemyCount.length; i++) {
        enemyCount.push(new EnemyCar());
      }
    }
    enemyCount.forEach((car) => {
      if (release) {
        if (!car.onscreen) {
          car.initialize();
          release = false;
        }
      }
      if (car.onscreen) {
        car.accelerate()
        PlayerCar.collision(playerCar, car)
      }
    });
  } else {
    gameContent.displayMenu();
  }

  gameContent.environment();

};

loop();