const startGame = () => {
  gameArea.start();
};

const rerenderGameArea = () => {
  // clear gamaarea
  gameArea.clear();
  // process before building
  if (gameArea.fallingTile.length > 0) {
    processFallingTile();
  }

  // mouse interaction
  if (gameArea.activeTile) {
    moveTile(gameArea.activeTile);
  }

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
  fallingTile: [],
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

      // console.log(`x: ${this.X_pos}, y: ${this.Y_pos}`);

      this.Col_pos = Math.min(
        Math.max(Math.floor(this.X_pos / gridOptions.tile_Width), 0),
        gridOptions.n_Col - 1
      );

      this.Row_pos = Math.min(
        Math.max(Math.floor(this.Y_pos / gridOptions.tile_Height), 0),
        gridOptions.n_Row - 1
      );
    });

    this.canvas.addEventListener("mousedown", (e) => {
      // left click detect
      if (e.which === 1) {
        let tile = this.tileGrid[this.Row_pos][this.Col_pos];
        if (tile) {
          // if we grab the falling tile, that fallingTile array will be changed
          if (this.fallingTile.flat().includes(tile)) {
            let top_Tile = this.fallingTile
              .map((tile_Stack) => tile_Stack.slice(-1))
              .flat();
            // the top stack of tile_Stack is grabable
            if (top_Tile.includes(tile)) {
              let index = top_Tile.indexOf(tile);
              this.fallingTile[index].pop();
              this.fallingTile = this.fallingTile.filter(
                (tile_Stack) => tile_Stack.length > 0
              );
            } // otherwise the tile is ungrabable
            else {
              return;
            }
          }

          this.activeTile = tile;

          // probably to this once
          // moveTile(this.activeTile);
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      if (this.activeTile) {
        // if there is a tile below
        if (this.activeTile.checkAdjacentTile().bottom) {
          this.activeTile.x =
            layoutOptions.padding +
            this.activeTile.Col_index * gridOptions.tile_Width +
            gridOptions.padding;
          this.activeTile.y =
            layoutOptions.padding +
            this.activeTile.Row_index * gridOptions.tile_Height +
            gridOptions.padding;
        } // process fall otherwise
        else {
          this.activeTile.x =
            layoutOptions.padding +
            this.activeTile.Col_index * gridOptions.tile_Width +
            gridOptions.padding;
          this.fallingTile.push([this.activeTile]);
        }
        this.activeTile = null;
      }
    });

    arrangeNewTile();
    window.requestAnimationFrame(rerenderGameArea);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

startGame();
