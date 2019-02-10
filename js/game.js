var bullets;
var sprite;
var cursors;
var last_used_bullet = 0;
var ctx;
var rocks;
var lives;
var score;

var a_key;
var w_key;
var d_key;

var game_scene = {
  name: "game_scene",
  preload: preload,
  create: create,
  update: update

};


function preload() {
  ctx = this;
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bullet', 'assets/bullet.png');
  this.load.image('ship', 'assets/ship.png');
  this.load.image('ship_thruster', 'assets/ship_tailflame.png');
  this.load.image('rock_big_1', 'assets/rock_big_1.png');
  this.load.image('rock_med_1', 'assets/rock_med_1.png');
  this.load.image('rock_sm_1', 'assets/rock_sm_1.png');

}

function create() {
  storage.loadData();
  score = 0;
  lives = storage.getLives();
  ctx = this;
  //this.add.image(400, 300, 'sky');

  sprite = this.physics.add.image(400, 300, 'ship');
  console.log(sprite.body.width);
  var orig_width = sprite.body.width;
  var orig_height = sprite.body.height;

  sprite.body.height *= 0.55;
  sprite.body.width = sprite.body.height;
  sprite.body.offset = {x: orig_width / 2 - sprite.body.width / 2, y: orig_height / 2 - sprite.body.height / 2};

  sprite.setDamping(true);
  sprite.setDrag(0.99);
  sprite.setMaxVelocity(200);

  sprite.setAngle(-90);

  cursors = this.input.keyboard.createCursorKeys();

  bullets = this.physics.add.group({
    key: 'bullet',
    repeat: storage.getMaxBullets() - 1
  });

  lives_icons = this.add.group({
    key: 'ship',
    repeat: storage.getLives() - 1
  });

  bullets.children.iterate(function (child, index) {

    child.disableBody(true, true);

  });

  // setup lives icons
  lives_icons.children.iterate(function (child, index) {
    if (!(index > lives - 1)) {
      child.setScale(1 / 2);
      child.width = child.width / 2;
      child.height = child.height / 2;
      child.setX((config.width - child.width) - (index * child.width) - index * 10);
      child.setY(child.height / 2 + 10);
      console.log("index: " + index + " lives: " + lives);
    } else {
      child.visible = false;
    }
  });


  speedText = this.add.text(10, 10, '', {font: '16px Courier', fill: '#00ff00'});
  scoreText = this.add.text(10, 30, '', {font: '16px Courier', fill: '#00ff00'});
  //this.input.keyboard.addKey([ Phaser.Input.Keyboard.KeyCodes.SPACEBAR ]);

  //console.log(this.physics.velocityFromAngle(sprite.angle, 600));

  this.input.keyboard.on('keydown_SPACE', function (event) {
    console.log('Hello from the space Key!');
    fireBullet();
  });

  a_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  w_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  d_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  rocks = this.physics.add.group();


  this.physics.add.collider(sprite, rocks, hitRock, null, this);
  this.physics.add.collider(bullets, rocks, shootRock, null, this);
  this.physics.add.collider(bullets, bullets, null, null, this);

  spawnStartingRocks();

}

function update() {
  if (cursors.up.isDown || w_key.isDown) {
    this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    sprite.setTexture('ship_thruster');
  }
  else {
    sprite.setTexture('ship');
    sprite.setAcceleration(0);
  }

  if (cursors.left.isDown || a_key.isDown) {
    sprite.setAngularVelocity(-300);
  }
  else if (cursors.right.isDown || d_key.isDown) {
    sprite.setAngularVelocity(300);
  }
  else {
    sprite.setAngularVelocity(0);
  }

  speedText.setText('Speed: ' + sprite.body.speed);
  scoreText.setText('Score: ' + score);


  this.physics.world.wrap(sprite, 32);
  var world = this.physics.world;
  rocks.children.iterate(function (child) {
    world.wrap(child, 32);
  });


  bullets.children.iterate(function (child) {
    if (child.x < 0 || child.x > config.width) {
      child.disableBody(true, true);
    }

    if (child.y < 0 || child.y > config.height) {
      child.disableBody(true, true);
    }


  });

  //drawLives()


}

function spawnStartingRocks() {
  createRock('rock_big_1');
}

function updateLivesIcons() {
  lives_icons.children.iterate(function (child, index) {
    if (!(index > lives - 1)) {
      child.visible = true;
    } else {
      child.visible = false;
    }
  });
}

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {

      child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

  }
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}


function createRock(type, location) {
  if (location == undefined) {
    var location = {x: Math.random() * config.width, y: Math.random() * config.height};
  }
  var rock = rocks.create(location.x, location.y, type);
  rock.setData("type", type);
  rock.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));

  orig_width = rock.body.width;
  orig_height = rock.body.height;
  rock.body.width *= 0.65;
  rock.body.height *= 0.65;
  rock.body.offset = {x: orig_width / 2 - rock.body.width / 2, y: orig_height / 2 - rock.body.height / 2};


  console.log(rocks);
}

function hitRock(sprite, rock) {
  clearRocks();
  this.physics.pause();

  sprite.setTint(0xff0000);
  lives -= 1;
  updateLivesIcons();
  console.log("lives: " + lives);
  if (lives <= 0) {
    storage.addScore(score);
    storage.addCoins(score / 5);
    storage.saveData();
    setTimeout(function () {
      console.log("back to menu");
      ctx.scene.start('menu_scene');
    }, 2000);
  } else {

    setTimeout(function () {
      console.log("back to game");
      sprite.setTint(0xffffff);
      ctx.physics.resume();

      spawnStartingRocks();

    }, 2000);
  }


}

function clearRocks() {
  rocks.clear(true);
}
function shootRock(bullet, rock) {
  //rock.disableBody(true, true);
  if (rock.getData("type") === 'rock_big_1') {
    score += 10;
    var new_rock_loc = {x: rock.x, y: rock.y};
    createRock('rock_med_1', new_rock_loc);
    createRock('rock_med_1', new_rock_loc);
    createRock('rock_med_1', new_rock_loc);
    if (Phaser.Math.Between(-100, 100) > 0) {
      createRock('rock_med_1', new_rock_loc);
    }

  } else if (rock.getData("type") === "rock_med_1") {
    score += 5;
    var new_rock_loc = {x: rock.x, y: rock.y};
    createRock('rock_sm_1', new_rock_loc);
    createRock('rock_sm_1', new_rock_loc);
    if (Phaser.Math.Between(-100, 100) > 0) {
      createRock('rock_sm_1', new_rock_loc);
    }
  }
  score += 2;
  rocks.remove(rock, true);
  bullet.disableBody(true, true);
  if (rocks.getLength() <= 0) {
    // you win
    this.physics.pause();

    sprite.setTint(0x00ff00);
    storage.addScore(score);
    storage.addCoins(score / 5);
    storage.saveData();
    setTimeout(function () {
      console.log("back to menu");
      ctx.scene.start('menu_scene');
    }, 2000);
  }


}

function fireBullet() {

  console.log(last_used_bullet);
  console.log(bullets.getChildren());

  if (storage.getDualLasersEnabled()) {
    var bullet = bullets.getChildren()[last_used_bullet];
    locs = getDualBulletStartingLocations(sprite.angle + 90);
    if (!bullet.active) {
      bullet.enableBody(true, locs[0].x, locs[0].y, true, true);
      bullet.setAngle(sprite.angle + 90);


      //console.log(ctx.physics.velocityFromAngle(sprite.angle, 300));

      var velo = ctx.physics.velocityFromAngle(sprite.angle, storage.getBulletSpeed());
      bullet.setVelocity(velo.x, velo.y);

      last_used_bullet += 1;
      if (last_used_bullet >= bullets.getChildren().length) {
        last_used_bullet = 0;
      }

    }

    var bullet = bullets.getChildren()[last_used_bullet];
    if (!bullet.active) {
      bullet.enableBody(true, locs[1].x, locs[1].y, true, true);
      bullet.setAngle(sprite.angle + 90);

      //console.log(ctx.physics.velocityFromAngle(sprite.angle, 300));

      var velo = ctx.physics.velocityFromAngle(sprite.angle, storage.getBulletSpeed());
      bullet.setVelocity(velo.x, velo.y);

      last_used_bullet += 1;
      if (last_used_bullet >= bullets.getChildren().length) {
        last_used_bullet = 0;
      }

    }
  } else {
    var bullet = bullets.getChildren()[last_used_bullet];
    if (!bullet.active) {
      bullet.enableBody(true, sprite.x, sprite.y, true, true);
      bullet.setAngle(sprite.angle + 90);
      bullet.body.allowRotation = true;

      //bullet.body.angle = bullet.angle;
      console.log("angle: " + bullet.body.angle);
      //console.log(ctx.physics.velocityFromAngle(sprite.angle, 300));

      var velo = ctx.physics.velocityFromAngle(sprite.angle, storage.getBulletSpeed());
      bullet.setVelocity(velo.x, velo.y);

      last_used_bullet += 1;
      if (last_used_bullet >= bullets.getChildren().length) {
        last_used_bullet = 0;
      }
    }


  }
}

function getDualBulletStartingLocations(angle) {
  console.log(angle);
  locs = [{x: 0, y: 0}, {x: 0, y: 0}];
  if ((angle < 45 && angle > -45) || (angle <= 225 && angle > 135)) {
    locs[0].x = sprite.x - 25;
    locs[1].x = sprite.x + 25;

    locs[0].y = sprite.y;
    locs[1].y = sprite.y;
  } else if ((angle < -45 || angle > 225) || (angle <= 135 && angle >= 45)) {
    locs[0].x = sprite.x;
    locs[1].x = sprite.x;

    locs[0].y = sprite.y - 25;
    locs[1].y = sprite.y + 25;
  }

  return locs;

}