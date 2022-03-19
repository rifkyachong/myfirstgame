const startGame = () => {
  gameArea.start();
  gameArea.tileGrid[0][0] = new Tile(4, 4, 62, 67, "red");
};

const rerenderGameArea = () => {
  // clear gamaarea
  gameArea.clear();
  // process before building

  // building game area
  gameArea.tileGrid
    .flat()
    .filter((tile) => tile instanceof Tile)
    .forEach((tile) => tile.render());
  // render
  window.requestAnimationFrame(rerenderGameArea);
};

const gridOptions = {
  n_Row: 8,
  n_Col: 7,
  tile_Width: 70,
  tile_Height: 75,
  padding: 4,
};

const layoutOptions = {
  padding: 5,
};

const gameArea = {
  canvas: document.createElement("canvas"),
  context: null,
  activeTile: null,
  X_pos: 0,
  Y_pos: 0,
  Col_pos: 0,
  Row_pos: 0,
  tileGrid: Array(gridOptions.n_Row)
    .fill()
    .map(() => new Array(gridOptions.n_Col)),
  start: function () {
    this.canvas.height =
      gridOptions.n_Row * gridOptions.tile_Height + 2 * layoutOptions.padding;
    this.canvas.width =
      gridOptions.n_Col * gridOptions.tile_Width + 2 * layoutOptions.padding;
    this.context = this.canvas.getContext("2d");
    document.getElementById("canvas-wrapper").append(this.canvas);

    this.canvas.addEventListener("mousemove", (e) => {
      this.X_pos =
        e.offsetX -
        parseFloat(getComputedStyle(e.target).getPropertyValue("padding-left"));
      this.Y_pos =
        e.offsetY -
        parseFloat(getComputedStyle(e.target).getPropertyValue("padding-top"));

      this.Col_pos = Math.min(
        Math.max(Math.floor(this.X_pos / gridOptions.tile_Width), 0),
        gridOptions.n_Col - 1
      );

      this.Row_pos = Math.min(
        Math.max(Math.floor(this.Y_pos / gridOptions.tile_Height), 0),
        gridOptions.n_Row - 1
      );

      if (this.activeTile) {
        moveTile(this.activeTile);
      }
    });

    this.canvas.addEventListener("mousedown", (e) => {
      // left click detect
      if (e.which === 1) {
        let tile = this.tileGrid[this.Row_pos][this.Col_pos];
        if (tile) {
          this.activeTile = tile;
          // tile.select();
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      if (this.activeTile) {
        // snap to grid
        this.activeTile.x =
          layoutOptions.padding +
          this.Col_pos * gridOptions.tile_Width +
          gridOptions.padding;
        this.activeTile.y =
          layoutOptions.padding +
          this.Row_pos * gridOptions.tile_Height +
          gridOptions.padding;
        this.activeTile = null;
      }
    });

    window.requestAnimationFrame(rerenderGameArea);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

startGame();
