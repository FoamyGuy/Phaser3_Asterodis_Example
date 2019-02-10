import 'phaser';

export default {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
      debug: true
    }
  }

};



