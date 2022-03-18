var myComponent, TextComponent;
var myObstacles;

const startGame = () => {
  gameArea.start();
  myComponent = new Component(0, 0, 20, 20, "green");
  myComponent.render();
  myTextComponent = new Text("12px monospace", "Testing", "black", 450, 290);
  myTextComponent.render();
  myObstacles = new Component(200, 100, 75, 75, "red");
  myObstacles.render();
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
  this.touch = (obstacle) => {
    let [topBound, bottomBound, leftBound, rightBound] = [
      obstacle.y - this.height,
      obstacle.y + obstacle.height,
      obstacle.x - this.width,
      obstacle.x + obstacle.width,
    ];

    if (
      this.x > leftBound &&
      this.x < rightBound &&
      this.y > topBound &&
      this.y < bottomBound
    ) {
      let distanceTop = Math.abs(this.y - topBound);
      let distanceBottom = Math.abs(this.y - bottomBound);
      let distanceLeft = Math.abs(this.x - leftBound);
      let distanceRight = Math.abs(this.x - rightBound);

      let closest = Math.min(
        distanceTop,
        distanceBottom,
        distanceLeft,
        distanceRight
      );
      if (closest === distanceTop) {
        this.y = topBound;
      }
      if (closest === distanceBottom) {
        this.y = bottomBound;
      }
      if (closest === distanceLeft) {
        this.x = leftBound;
      }
      if (closest === distanceRight) {
        this.x = rightBound;
      }
    }
    // let [top, bottom, left, right] = [
    //   this.y,
    //   this.y + this.height,
    //   this.x,
    //   this.x + this.width,
    // ];
    // let [topObs, bottomObs, leftObs, rightObs] = [
    //   obstacle.y,
    //   obstacle.y + obstacle.height,
    //   obstacle.x,
    //   obstacle.x + obstacle.width,
    // ];
    // if (
    //   bottom > topObs &&
    //   top < bottomObs &&
    //   right > leftObs &&
    //   left < leftObs
    // ) {
    //   this.x = leftObs - this.width;
    // }
    // if (
    //   bottom > topObs &&
    //   top < bottomObs &&
    //   left < rightObs &&
    //   right > rightObs
    // ) {
    //   this.x = rightObs;
    // }
    // if (right > leftObs && left < rightObs && bottom > topObs && top < topObs) {
    //   this.y = topObs - this.height;
    // }
    // if (
    //   right > leftObs &&
    //   left < rightObs &&
    //   top < bottomObs &&
    //   bottom > bottomObs
    // ) {
    //   this.y = bottomObs;
    // }

    // if (
    //   left > obstacle.x - this.width &&
    //   left < obstacle.x + obstacle.width &&
    //   top > obstacle.y - this.height &&
    //   top < obstacle.y + obstacle.height
    // ) {
    //   if (this.speedX > 0) {
    //     this.x = obstacle.x - this.width;
    //   }
    //   if (this.speedX < 0) {
    //     this.x = obstacle.x + obstacle.width;
    //   }
    //   if (this.speedY > 0) {
    //     this.y = obstacle.y - this.height;
    //   }
    //   if (this.speedY < 0) {
    //     this.y = obstacle.y + obstacle.height;
    //   }
    // }

    // if (this.speedX > 0 && right > obstacle.x) {
    //   this.x = obstacle.x - this.width;
    // }
    // if (this.speedX < 0 && left < obstacle.x + obstacle.width) {
    //   this.x = obstacle.x + obstacle.width;
    // }
    // if (this.speedY > 0 && bottom > obstacle.y) {
    //   this.y = obstacle.y - this.height;
    // }
    // if (this.speedY < 0 && top < obstacle.y + obstacle.height) {
    //   this.y = obstacle.y + obstacle.width;
    // }
  };
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

  if (myComponent.onDrag) {
    myComponent.x = gameArea.cursorPosX - myComponent.initialOffsetLeft;
    myComponent.y = gameArea.cursorPosY - myComponent.initialOffsetTop;
  }

  myComponent.touch(myObstacles);

  myComponent.render();
  myTextComponent.render();
  myObstacles.render();
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
