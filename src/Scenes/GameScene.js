import 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('ship_thruster', 'assets/ship_tailflame.png');
    this.load.image('rock_big_1', 'assets/rock_big_1.png');
    this.load.image('rock_med_1', 'assets/rock_med_1.png');
    this.load.image('rock_sm_1', 'assets/rock_sm_1.png');

  }

  create() {
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
      repeat: 5
    });

    bullets.children.iterate(function (child) {

      child.disableBody(true, true);

    });

    text = this.add.text(10, 10, '', {font: '16px Courier', fill: '#00ff00'});
    //this.input.keyboard.addKey([ Phaser.Input.Keyboard.KeyCodes.SPACEBAR ]);

    //console.log(this.physics.velocityFromAngle(sprite.angle, 600));

    this.input.keyboard.on('keydown_SPACE', function (event) {
      console.log('Hello from the space Key!');
      fireBullet();
    });

    rocks = this.physics.add.group();


    this.physics.add.collider(sprite, rocks, hitRock, null, this);
    this.physics.add.collider(bullets, rocks, shootRock, null, this);
    this.physics.add.collider(bullets, bullets, null, null, this);

    /*platforms = this.physics.add.staticGroup();

     platforms.create(400, 568, 'ground').setScale(2).refreshBody();

     platforms.create(600, 400, 'ground');
     platforms.create(50, 250, 'ground');
     platforms.create(750, 220, 'ground');*/

    createRock('rock_big_1');
  }

  update() {
    if (cursors.up.isDown) {
      this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
      sprite.setTexture('ship_thruster');
    }
    else {
      sprite.setTexture('ship');
      sprite.setAcceleration(0);
    }

    if (cursors.left.isDown) {
      sprite.setAngularVelocity(-300);
    }
    else if (cursors.right.isDown) {
      sprite.setAngularVelocity(300);
    }
    else {
      sprite.setAngularVelocity(0);
    }

    text.setText('Speed: ' + sprite.body.speed);


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

  }

  createRock(type, location) {
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

  }

  hitRock(sprite, rock) {
    this.physics.pause();

    sprite.setTint(0xff0000);
    gameOver = true;
  }

  shootRock(bullet, rock) {
    //rock.disableBody(true, true);
    if (rock.getData("type") === 'rock_big_1') {
      var new_rock_loc = {x: rock.x, y: rock.y};
      createRock('rock_med_1', new_rock_loc);
      createRock('rock_med_1', new_rock_loc);
      createRock('rock_med_1', new_rock_loc);
      if (Phaser.Math.Between(-100, 100) > 0) {
        createRock('rock_med_1', new_rock_loc);
      }

    } else if (rock.getData("type") === "rock_med_1") {
      var new_rock_loc = {x: rock.x, y: rock.y};
      createRock('rock_sm_1', new_rock_loc);
      createRock('rock_sm_1', new_rock_loc);
      if (Phaser.Math.Between(-100, 100) > 0) {
        createRock('rock_sm_1', new_rock_loc);
      }
    }

    rocks.remove(rock, true);
    bullet.disableBody(true, true);


  }

  fireBullet() {

    console.log(last_used_bullet);
    console.log(bullets.getChildren());
    var bullet = bullets.getChildren()[last_used_bullet];
    locs = getDualBulletStartingLocations(sprite.angle + 90);
    if (!bullet.active) {
      bullet.enableBody(true, locs[0].x, locs[0].y, true, true);
      bullet.setAngle(sprite.angle + 90);

      //console.log(ctx.physics.velocityFromAngle(sprite.angle, 300));

      var velo = ctx.physics.velocityFromAngle(sprite.angle, 300);
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

      var velo = ctx.physics.velocityFromAngle(sprite.angle, 300);
      bullet.setVelocity(velo.x, velo.y);

      last_used_bullet += 1;
      if (last_used_bullet >= bullets.getChildren().length) {
        last_used_bullet = 0;
      }

    }

  }

  getDualBulletStartingLocations(angle) {
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


};
