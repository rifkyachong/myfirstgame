var myComponent;
var upBtn, downBtn, leftBtn, rightBtn, moveBtns;

const startGame = () => {
  gameArea.start();
  myComponent = new Component(50, 50, 10, 10, "red");
  myComponent.render();
  // controllers
  upBtn = document.getElementById("up-btn");
  leftBtn = document.getElementById("left-btn");
  rightBtn = document.getElementById("right-btn");
  downBtn = document.getElementById("down-btn");
  moveBtns = document.querySelectorAll(".move-btn");

  // for (let btn of moveBtns) {
  //   btn.onclick = handleClick;
  //   btn.onmouseup = handleMouseUp;
  //   btn.onmousedown = handleMouseDown;
  //   // console.log(btn);
  //   // btn.onmouseup = (e) => {
  //   //   console.log("onmouseup clicked");
  //   //   myComponent.speedX = 0;
  //   //   myComponent.speedY = 0;
  //   // };
  // }
};

function Component(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.speedX = 0;
  this.speedY = 0;
  this.render = () => {
    gameArea.context.fillStyle = this.color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
  this.newPos = () => {
    this.x += this.speedX;
    this.y += this.speedY;
  };
}

const rerenderGameArea = () => {
  gameArea.clear();
  let sumSpeedX = 0;
  let sumSpeedY = 0;
  if (gameArea.keys && gameArea.keys["ArrowUp"]) {
    sumSpeedY -= 1;
  }
  if (gameArea.keys && gameArea.keys["ArrowDown"]) {
    sumSpeedY += 1;
  }
  if (gameArea.keys && gameArea.keys["ArrowLeft"]) {
    sumSpeedX -= 1;
  }
  if (gameArea.keys && gameArea.keys["ArrowRight"]) {
    sumSpeedX += 1;
  }
  myComponent.speedX = sumSpeedX;
  myComponent.speedY = sumSpeedY;
  myComponent.newPos();
  myComponent.render();
  //process before update
  window.requestAnimationFrame(rerenderGameArea);
};

const gameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 500;
    this.canvas.height = 300;
    document.getElementById("canvas-wrapper").append(this.canvas);
    this.context = this.canvas.getContext("2d");

    window.addEventListener("keydown", (e) => {
      this.keys = this.keys || [];
      console.log(e.key);
      // console.log(this.keys);
      this.keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
      // console.log(this.keys);
    });
  },
  clear: function () {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },
  // this is wierd because interval probably will deleted after the first render
  interval: window.requestAnimationFrame(rerenderGameArea),
};

startGame();
