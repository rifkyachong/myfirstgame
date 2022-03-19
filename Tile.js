// dependencies: gameArea, gridOptions

function Tile(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  // this is temporary
  this.Row_index = 0;
  this.Col_index = 0;

  this.width = width;
  this.height = height;
  this.color = color;
  this.boundary = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };
  this.render = function () {
    gameArea.context.fillStyle = color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
  this.checkAdjacentTile = function () {
    // check right
    if (
      this.Col_index + 1 === gridOptions.n_Col ||
      gameArea.tileGrid[this.Row_index][this.Col_index + 1] instanceof Tile
    ) {
      this.boundary.right = true;
    } else {
      this.boundary.right = false;
    }

    // check left
    if (
      this.Col_index === 0 ||
      gameArea.tileGrid[this.Row_index][this.Col_index - 1] instanceof Tile
    ) {
      this.boundary.left = true;
    } else {
      this.boundary.left = false;
    }

    // check top
    if (
      this.Row_index === 0 ||
      gameArea.tileGrid[this.Row_index - 1][this.Col_index] instanceof Tile
    ) {
      this.boundary.top = true;
    } else {
      this.boundary.top = false;
    }

    // check bottom
    if (
      this.Row_index + 1 === gridOptions.n_Row ||
      gameArea.tileGrid[this.Row_index + 1][this.Col_index] instanceof Tile
    ) {
      this.boundary.bottom = true;
    } else {
      this.boundary.bottom = false;
    }

    // console.log(
    //   `top: ${this.boundary.top}, bottom: ${this.boundary.bottom}, left: ${this.boundary.left}, right: ${this.boundary.right}`
    // );
    return this.boundary;
  };
}

const moveTile = (tile) => {
  const adjacentTile = tile.checkAdjacentTile();
  const [new_Row_Index, new_Col_Index] = [gameArea.Row_pos, gameArea.Col_pos];

  // if there is no adjacent top boundary and the new posision is above previous position
  if (!adjacentTile.top && new_Row_Index < tile.Row_index) {
    tile.Row_index = new_Row_Index;
  }
  if (!adjacentTile.bottom && new_Row_Index > tile.Row_index) {
    tile.Row_index = new_Row_Index;
  }

  if (!adjacentTile.left && new_Col_Index < tile.Col_index) {
    tile.Col_index = new_Col_Index;
  }
  if (!adjacentTile.right && new_Col_Index > tile.Col_index) {
    tile.Col_index = new_Col_Index;
  }

  // update tile grid if there is an actual change in tile position
  const [prev_Row_Index, prev_Col_Index] = gameArea.tileGrid.multiIndexOf(tile);
  if ([prev_Row_Index, prev_Col_Index] !== [tile.Row_index, tile.Col_index]) {
    gameArea.tileGrid[prev_Row_Index][prev_Col_Index] = null;
    gameArea.tileGrid[tile.Row_index][tile.Col_index] = tile;
  }

  // calculate position as a function of cursor position depending on boundary condition (this is for rendering purposes)
  const X_center_Pos =
    layoutOptions.padding + (tile.Col_index + 0.5) * gridOptions.tile_Width;
  const Y_center_Pos =
    layoutOptions.padding + (tile.Row_index + 0.5) * gridOptions.tile_Height;

  // top boundary
  const reduceSensitivity = 0.1;
  if (gameArea.Y_pos < Y_center_Pos) {
    if (adjacentTile.top) {
      // restriced movement
      tile.y =
        Y_center_Pos +
        Math.max(
          (gameArea.Y_pos - Y_center_Pos) * reduceSensitivity,
          -1.5 * gridOptions.padding
        ) -
        0.5 * tile.height;
    } else {
      tile.y = gameArea.Y_pos - tile.height * 0.5;
    }
  } else {
    if (adjacentTile.bottom) {
      tile.y =
        Y_center_Pos +
        Math.min(
          (gameArea.Y_pos - Y_center_Pos) * reduceSensitivity,
          1.5 * gridOptions.padding
        ) -
        0.5 * tile.height;
    } else {
      tile.y = gameArea.Y_pos - tile.height * 0.5;
    }
  }

  if (gameArea.X_pos < X_center_Pos) {
    if (adjacentTile.left) {
      tile.x =
        X_center_Pos +
        Math.max(
          (gameArea.X_pos - X_center_Pos) * reduceSensitivity,
          -1.5 * gridOptions.padding
        ) -
        0.5 * tile.width;
    } else {
      tile.x = gameArea.X_pos - tile.width * 0.5;
    }
  } else {
    if (adjacentTile.right) {
      tile.x =
        X_center_Pos +
        Math.min(
          (gameArea.X_pos - X_center_Pos) * reduceSensitivity,
          1.5 * gridOptions.padding
        ) -
        0.5 * tile.width;
    } else {
      tile.x = gameArea.X_pos - tile.width * 0.5;
    }
  }
};
