var score = 0;
var scoreText;

var game = new Phaser.Game(config);

game.scene.add('menu_scene', menu_scene);
game.scene.add('game_scene', game_scene);
game.scene.add('mechanic_scene', mechanic_scene);

game.scene.start('menu_scene');