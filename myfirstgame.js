var myComponent, TextComponent;
var upBtn, downBtn, leftBtn, rightBtn, moveBtns;

const startGame = () => {
  gameArea.start();
  myComponent = new Component(0, 0, 20, 20, "red");
  myComponent.render();
  myTextComponent = new Text("12px monospace", "Testing", "black", 450, 290);
  myTextComponent.render();
  // controllers
  upBtn = document.getElementById("up-btn");
  leftBtn = document.getElementById("left-btn");
  rightBtn = document.getElementById("right-btn");
  downBtn = document.getElementById("down-btn");
  moveBtns = document.querySelectorAll(".move-btn");
};

function Text(font, text, style, x, y) {
  this.font = font;
  this.text = text;
  this.style = style;
  this.x = x;
  this.y = y;
  this.render = () => {
    gameArea.context.font = this.font;
    gameArea.context.fillStyle = this.style;
    gameArea.context.fillText(this.text, this.x, this.y);
  };
}

function Component(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.speedX = 0;
  this.speedY = 0;
  this.onDrag = false;
  this.initialOffsetTop = 0;
  this.initialOffsetLeft = 0;
  this.render = () => {
    gameArea.context.fillStyle = this.color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
  this.newPos = () => {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  // this.onDrag = () => {
  //   let onDrag = false;
  //   let left = this.x;
  //   let right = this.x + this.width;
  //   let top = this.y;
  //   let bottom = this.y + this.height;
  //   if (gameArea.cursorPosX && gameArea.cursorPosY) {
  //     if (gameArea.cursorPosX > left && gameArea.cursorPosX < right && gameArea.cursorPosY > top && gameArea.cursorPosY < bottom ) {
  //       this.initialOffsetLeft = gameArea.cursorPosX - this.x;
  //       this.initialOffsetTop = gameArea.cursorPosY - this.y;
  //       onDrag = true;
  //     }
  //   }
  //   return onDrag;
  // }
}

const detectClick = () => {
  let left = myComponent.x;
  let right = myComponent.x + myComponent.width;
  let top = myComponent.y;
  let bottom = myComponent.y + myComponent.height;
  if (
    gameArea.cursorPosX > left &&
    gameArea.cursorPosX < right &&
    gameArea.cursorPosY > top &&
    gameArea.cursorPosY < bottom
  ) {
    myComponent.initialOffsetLeft = gameArea.cursorPosX - myComponent.x;
    myComponent.initialOffsetTop = gameArea.cursorPosY - myComponent.y;
    myComponent.onDrag = true;
  }
};

const rerenderGameArea = () => {
  gameArea.clear();
  // let sumSpeedX = 0;
  // let sumSpeedY = 0;
  // if (gameArea.keys && gameArea.keys["ArrowUp"]) {
  //   sumSpeedY -= 1;
  // }
  // if (gameArea.keys && gameArea.keys["ArrowDown"]) {
  //   sumSpeedY += 1;
  // }
  // if (gameArea.keys && gameArea.keys["ArrowLeft"]) {
  //   sumSpeedX -= 1;
  // }
  // if (gameArea.keys && gameArea.keys["ArrowRight"]) {
  //   sumSpeedX += 1;
  // }
  // myComponent.speedX = sumSpeedX;
  // myComponent.speedY = sumSpeedY;
  // myComponent.newPos();

  if (myComponent.onDrag) {
    myComponent.x = gameArea.cursorPosX - myComponent.initialOffsetLeft;
    myComponent.y = gameArea.cursorPosY - myComponent.initialOffsetTop;
  }

  myComponent.render();
  myTextComponent.render();
  //process before update
  window.requestAnimationFrame(rerenderGameArea);
};

const release = () => {
  myComponent.onDrag = false;
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
      // console.log(this.keys);
      this.keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
      // console.log(this.keys);
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.cursorPosX =
        e.offsetX -
        parseFloat(getComputedStyle(e.target).getPropertyValue("padding-left"));
      this.cursorPosY =
        e.offsetY -
        parseFloat(getComputedStyle(e.target).getPropertyValue("padding-top"));
      // console.log(`cursorX: ${this.cursorPosX}, cursorY: ${this.cursorPosY}`);
    });
    this.canvas.addEventListener("mousedown", (e) => {
      detectClick();
    });
    this.canvas.addEventListener("mouseup", (e) => {
      release();
    });
    // this.canvas.addEventListener("mousedown", (e) => {
    //   console.log("onmousedown called");
    //   if (e.which === 1) {
    //     myComponent.initialOffsetTop =
    //       e.offsetY -
    //       parseFloat(
    //         getComputedStyle(e.target).getPropertyValue("padding-top")
    //       ) -
    //       myComponent.y;
    //     myComponent.initialOffsetLeft =
    //       e.offsetX -
    //       parseFloat(
    //         getComputedStyle(e.target).getPropertyValue("padding-left")
    //       ) -
    //       myComponent.x;
    //     myComponent.onDrag = true;
    //   }
    // });
    // this.canvas.addEventListener("mouseup", (e) => {
    //   if (e.which === 1) {
    //     myComponent.onDrag = false;
    //   }
    // });
    // this.canvas.addEventListener("mousemove", (e) => {
    //   console.log(`x: ${e.pageX} , y: ${e.pageY}`);
    //   if (myComponent.onDrag) {
    //     myComponent.y =
    //       e.offsetY -
    //       parseFloat(
    //         getComputedStyle(e.target).getPropertyValue("padding-top")
    //       ) -
    //       myComponent.initialOffsetTop;
    //     myComponent.x =
    //       e.offsetX -
    //       parseFloat(
    //         getComputedStyle(e.target).getPropertyValue("padding-left")
    //       ) -
    //       myComponent.initialOffsetLeft;
    //   }
    // });
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
