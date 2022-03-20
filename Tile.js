// dependencies: gameArea, gridOptions

function Tile(Row_index, Col_index, color) {
  this.x =
    layoutOptions.padding +
    Col_index * gridOptions.tile_Width +
    gridOptions.padding;
  this.y =
    layoutOptions.padding +
    Row_index * gridOptions.tile_Height +
    gridOptions.padding;
  // this is temporary
  this.Row_index = Row_index;
  this.Col_index = Col_index;

  this.fallingSpeed = null;
  this.width = gridOptions.tile_Width - 2 * gridOptions.padding;
  this.height = gridOptions.tile_Height - 2 * gridOptions.padding;
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
  let adjacentTile = tile.checkAdjacentTile();
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
  if (prev_Row_Index !== tile.Row_index || prev_Col_Index !== tile.Col_index) {
    gameArea.tileGrid[prev_Row_Index][prev_Col_Index] = null;
    gameArea.tileGrid[tile.Row_index][tile.Col_index] = tile;

    // check if there is potential falling element (only for side movement)
    if (prev_Col_Index !== tile.Col_index) {
      let tile_Stack = [];
      if (prev_Row_Index > 0) {
        let i_Row_Index = prev_Row_Index - 1;
        while (gameArea.tileGrid[i_Row_Index][prev_Col_Index]) {
          tile_Stack.push(gameArea.tileGrid[i_Row_Index][prev_Col_Index]);
          i_Row_Index -= 1;
          if (i_Row_Index < 0) {
            break;
          }
        }
      }
      if (tile_Stack.length > 0) {
        gameArea.fallingTile.push(tile_Stack);
      }
    }
  }

  // calculate position as a function of cursor position depending on boundary condition (this is for rendering purposes)
  const X_center_Pos =
    layoutOptions.padding + (tile.Col_index + 0.5) * gridOptions.tile_Width;
  const Y_center_Pos =
    layoutOptions.padding + (tile.Row_index + 0.5) * gridOptions.tile_Height;

  adjacentTile = tile.checkAdjacentTile();

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

const processFallingTile = () => {
  gameArea.fallingTile = gameArea.fallingTile.filter((tile_Stack) => {
    tile_Stack.forEach((tile) => {
      if (tile.fallingSpeed === null) {
        tile.fallingSpeed = 0;
      }

      let acceleration = 0.2;
      let terminalVel = 3;

      tile.fallingSpeed = Math.min(
        tile.fallingSpeed + acceleration,
        terminalVel
      );

      tile.y += tile.fallingSpeed;

      // update that tileGrid
      let new_Row_index = Math.floor(
        (tile.y + tile.height * 0.5) / gridOptions.tile_Height
      );
      if (new_Row_index !== tile.Row_index) {
        gameArea.tileGrid[tile.Row_index][tile.Col_index] = null;
        gameArea.tileGrid[new_Row_index][tile.Col_index] = tile;
        tile.Row_index = new_Row_index;
      }
    });
    const boundary = tile_Stack[0].checkAdjacentTile();
    if (boundary.bottom) {
      if (
        tile_Stack[0].y >
        tile_Stack[0].Row_index * gridOptions.tile_Height +
          gridOptions.padding +
          layoutOptions.padding
      ) {
        // stop the falling process
        tile_Stack.forEach((tile) => {
          tile.y =
            tile.Row_index * gridOptions.tile_Height +
            gridOptions.padding +
            layoutOptions.padding;
        });
        return false;
      }
    }
    // continue the falling process
    return true;
  });
};

const arrangeNewTile = () => {
  let i = 0;
  while (i < 7) {
    gameArea.tileGrid[7][i] = new Tile(7, i, generateRandomColor());
    i++;
  }
};
