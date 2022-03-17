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

  upBtn.onmousedown = (e) => {
    console.log("onclick called");
    myComponent.speedY = -1;
  };
  downBtn.onmousedown = (e) => {
    myComponent.speedY = 1;
  };
  rightBtn.onmousedown = (e) => {
    myComponent.speedX = 1;
  };
  leftBtn.onmousedown = (e) => {
    myComponent.speedX = -1;
  };

  [...moveBtns].forEach(
    (btn) =>
      (btn.onmouseup = (e) => {
        myComponent.speedX = 0;
        myComponent.speedY = 0;
      })
  );

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
}

const rerenderGameArea = () => {
  gameArea.clear();
  myComponent.x += myComponent.speedX;
  myComponent.y += myComponent.speedY;
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
  },
  clear: function () {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },
  interval: window.requestAnimationFrame(rerenderGameArea),
};

const handleMouseDown = (e) => {
  console.log(`onmousedown: ${e.target.id}, button: ${e.which}`);
};

const handleMouseUp = (e) => {
  console.log(`onmouseup: ${e.target.id}, button: ${e.which}`);
};

const handleClick = (e) => {
  console.log(`onclick: ${e.target.id}, button: ${e.which}`);
};

const handleKeyDown = (e) => {
  console.log(`key: ${e.key}`);
};
startGame();
