var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
      debug: false
    }
  }

};

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};