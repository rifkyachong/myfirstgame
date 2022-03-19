// dependencies: gameArea

function Tile(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.render = function () {
    gameArea.context.fillStyle = color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
  this.select = function () {};
}

const moveTile = (tile) => {
  tile.x = gameArea.X_pos - tile.width * 0.5;
  tile.y = gameArea.Y_pos - tile.height * 0.5;

  // update tileGrid
  const [row, col] = gameArea.tileGrid.multiIndexOf(tile);
  gameArea.tileGrid[row][col] = null;
  gameArea.tileGrid[gameArea.Row_pos][gameArea.Col_pos] = tile;
};
