var menu_scene = {
  name: "menu_scene",
  preload: preload,
  create: create,
  update: update

};


function preload() {
  this.load.image('play_btn', 'assets/play_btn.png');
  this.load.image('play_btn_hover', 'assets/play_btn_hover.png');
  this.load.image('play_btn_pressed', 'assets/play_btn_pressed.png');
  this.load.image('mechanic_btn', 'assets/mechanic_btn.png');
  this.load.image('mechanic_btn_hover', 'assets/mechanic_btn_hover.png');
  this.load.image('mechanic_btn_pressed', 'assets/mechanic_btn_pressed.png');
}

function create() {
  var ctx = this;
  storage.loadData();
  var click_listeners = {
    "play_btn": function () {
      console.log("play button click");
      //ctx.scene.start(game_scene);
      play_btn.setTexture('play_btn_pressed');
      ctx.scene.start('game_scene');

    },
    "mechanic_btn": function(){
      console.log("mechanic butn click");
      ctx.scene.start('mechanic_scene');
    }
  };

  coinsText = this.add.text(-config.width / 2 + 10, -config.height / 2 + 10, 'Coins: ' + storage.getCoins(), {
    font: '16px Courier',
    fill: '#00ff00'
  });

  function onObjectClicked(pointer, gameObject) {
    //console.log(gameObject.texture.key);
    if (gameObject.hasOwnProperty("btn_name")) {
      click_listeners[gameObject.btn_name]();
    } else {
      click_listeners[gameObject.texture.key]();
    }

  }


  var play_btn = this.add.image(0, 0, 'play_btn');
  play_btn.btn_name = "play_btn";
  play_btn.setInteractive()
    .on('pointerover', function () {
      play_btn.setTexture("play_btn_hover");
    })
    .on('pointerdown', function () {
      play_btn.setTexture("play_btn_pressed");
    })
    .on('pointerup', function () {
      play_btn.setTexture('play_btn_hover');
      click_listeners['play_btn']();
    })
    .on('pointerout', function () {
      play_btn.setTexture("play_btn");
    });


  var mechanic_btn = this.add.image(0, play_btn.height, 'mechanic_btn');
  mechanic_btn.btn_name = "mechanic_btn";
  mechanic_btn.setInteractive()
    .on('pointerover', function () {
      mechanic_btn.setTexture("mechanic_btn_hover");
    })
    .on('pointerdown', function () {
      mechanic_btn.setTexture("mechanic_btn_pressed");
    })
    .on('pointerup', function () {
      mechanic_btn.setTexture('mechanic_btn_hover');
      console.log("mech btn");
      click_listeners['mechanic_btn']();
    })
    .on('pointerout', function () {
      mechanic_btn.setTexture("mechanic_btn");
    });

  this.cameras.main.centerOn(0, 0);
}

function update() {
  //coinsText.setText("Coins: " + storage.getCoins());

}

