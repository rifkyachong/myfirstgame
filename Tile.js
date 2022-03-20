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
  this.verifyPath = function (destinationPoint) {
    // destination and origin has to be different, if in the moveTile
    let [destination_Row, destination_Col] = destinationPoint;
    let [current_Row, current_Col] = [this.Row_index, this.Col_index];
    while (current_Row !== destination_Row) {
      let step_Row = destination_Row > current_Row ? 1 : -1;
      if (
        gameArea.tileGrid[current_Row + step_Row][current_Col] instanceof Tile
      ) {
        return [current_Row, current_Col];
      }
      current_Row += step_Row;
    }
    while (current_Col !== destination_Col) {
      let step_Col = destination_Col > current_Col ? 1 : -1;
      if (
        gameArea.tileGrid[current_Row][current_Col + step_Col] instanceof Tile
      ) {
        return [current_Row, current_Col];
      }
      current_Col += step_Col;
    }
    return [current_Row, current_Col];
  };
}

const moveTile = (tile) => {
  const [new_Row_Index, new_Col_Index] = tile.verifyPath([
    gameArea.Row_pos,
    gameArea.Col_pos,
  ]);

  const [prev_Row_Index, prev_Col_Index] = [tile.Row_index, tile.Col_index];
  tile.Row_index = new_Row_Index;
  tile.Col_index = new_Col_Index;

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
    tile_Stack.forEach((tile, index) => {
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

      const boundary = tile.checkAdjacentTile();
      if (!boundary.bottom) {
        // update that tileGrid
        let new_Row_index = Math.floor(
          (tile.y + tile.height) / gridOptions.tile_Height
        );
        if (new_Row_index !== tile.Row_index) {
          gameArea.tileGrid[tile.Row_index][tile.Col_index] = null;
          gameArea.tileGrid[new_Row_index][tile.Col_index] = tile;
          tile.Row_index = new_Row_index;
        }
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
          tile.fallingSpeed = null;
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
  i = 0;
  while (i < 7) {
    gameArea.tileGrid[6][i] = new Tile(6, i, generateRandomColor());
    i++;
  }
};
