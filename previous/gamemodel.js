var myComponent, TextComponent;
var myObstacles;

const areIntersected = (lineA, lineB) => {
  let [[Xo_a, Yo_a], [X_a, Y_a]] = lineA;
  let [[Xo_b, Yo_b], [X_b, Y_b]] = lineB;

  // Ax + By = C
  let [A_1, B_1, C_1] = [
    Y_a - Yo_a,
    X_a - Xo_a,
    (Y_a - Yo_a) * Xo_a + (X_a - Xo_a) * Yo_a,
  ];
  let [A_2, B_2, C_2] = [
    Y_b - Yo_b,
    X_b - Xo_b,
    (Y_b - Yo_b) * Xo_b + (X_b - Xo_b) * Yo_b,
  ];

  let Denominator = A_1 * B_2 - A_2 * B_1;

  if (Denominator == 0) {
    return false;
  }

  let [X, Y] = [
    (B_2 * C_1 - B_1 * C_2) / Denominator,
    (A_1 * C_2 - A_2 * C_1) / Denominator,
  ];

  [Xo_a, X_a] = [Math.min(Xo_a, X_a), Math.max(Xo_a, X_a)];
  [Xo_b, X_b] = [Math.min(Xo_b, X_b), Math.max(Xo_b, X_b)];

  if (
    Xo_a <= X &&
    X <= X_a &&
    Xo_b <= X &&
    X <= X_b &&
    Yo_a <= Y &&
    Y <= Y_a &&
    Yo_b <= Y &&
    Y <= Y_b
  ) {
    return true;
  }

  return false;
};

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
  this.rightMax;
  this.leftMax;
  this.topMax;
  this.bottomMax;
  this.speedX = null;
  this.speedY = null;
  this.width = width;
  this.height = height;
  this.color = color;
  this.onDrag = false;
  this.initialOffsetTop = 0;
  this.initialOffsetLeft = 0;
  this.onFall = true;
  this.render = () => {
    gameArea.context.fillStyle = this.color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
  this.checkBoundary = (obstacle) => {
    let [top, bottom, left, right] = [
      obstacle.y - this.height,
      obstacle.y + obstacle.height,
      obstacle.x - this.width,
      obstacle.x + obstacle.width,
    ];
    // right obstacle
    if (
      this.x <= left &&
      areIntersected(
        [
          [0, this.y],
          [gameArea.canvas.width, this.y],
        ],
        [
          [left, top],
          [left, bottom],
        ]
      )
    ) {
      this.rightMax = left;
    } else {
      this.rightMax = gameArea.canvas.width - this.width;
    }

    // left obstacle
    if (
      this.x >= right &&
      areIntersected(
        [
          [0, this.y],
          [gameArea.canvas.width, this.y],
        ],
        [
          [right, top],
          [right, bottom],
        ]
      )
    ) {
      this.leftMax = right;
    } else {
      this.leftMax = 0;
    }

    // bottom obstacle
    if (
      this.y <= top &&
      areIntersected(
        [
          [this.x, 0],
          [this.x, gameArea.canvas.height],
        ],
        [
          [right, top],
          [left, top],
        ]
      )
    ) {
      this.bottomMax = top;
    } else {
      this.bottomMax = gameArea.canvas.height - this.height;
    }

    if (
      this.y >= bottom &&
      areIntersected(
        [
          [this.x, 0],
          [this.x, gameArea.canvas.height],
        ],
        [
          [right, bottom],
          [left, bottom],
        ]
      )
    ) {
      this.topMax = bottom;
    } else {
      this.topMax = 0;
    }
  };
  this.newPos = () => {
    if (this.x > this.rightMax) {
      this.x = this.rightMax;
    }
    if (this.x < this.leftMax) {
      this.x = this.leftMax;
    }
    if (this.y > this.bottomMax) {
      this.y = this.bottomMax;
    }
    if (this.y < this.topMax) {
      this.y = this.topMax;
    }
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

  myComponent.checkBoundary(myObstacles);

  if (myComponent.onDrag) {
    myComponent.x = gameArea.cursorPosX - myComponent.initialOffsetLeft;
    myComponent.y = gameArea.cursorPosY - myComponent.initialOffsetTop;
    myComponent.dx = gameArea.deltaX;
    myComponent.dy = gameArea.deltaY;
  } else if (myComponent.onFall) {
    myComponent.speedY = Math.min(myComponent.speedY + 0.1, 10);
    myComponent.y += myComponent.speedY;
    if (myComponent.y > myComponent.bottomMax) {
      myComponent.onFall = false;
      myComponent.speedY = 0;
    }
  }

  myComponent.newPos();
  myComponent.render();
  myTextComponent.render();
  myObstacles.render();
  //process before update
  window.requestAnimationFrame(rerenderGameArea);
};

const release = () => {
  myComponent.onDrag = false;
  myComponent.onFall = true;
};

const gameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 500;
    this.canvas.height = 300;
    document.getElementById("canvas-wrapper").append(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("mousemove", (e) => {
      this.cursorPosX =
        e.offsetX -
        parseFloat(getComputedStyle(e.target).getPropertyValue("padding-left"));
      this.cursorPosY =
        e.offsetY -
        parseFloat(getComputedStyle(e.target).getPropertyValue("padding-top"));
      // console.log(`cursorX: ${this.cursorPosX}, cursorY: ${this.cursorPosY}`);
      this.deltaX = e.movementX;
      this.deltaY = e.movementY;
      console.log(`cursorX: ${this.deltaX}, cursorY: ${this.deltaY}`);
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
