var mechanic_scene = {
  name: "mechanic_scene",
  preload: preload,
  create: create,
  update: update

};


function preload() {
  this.load.scenePlugin({
    key: 'rexuiplugin',
    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
    sceneKey: 'rexUI'
  });
  this.load.image('ship', 'assets/ship.png');
  this.load.image('dual_bullet_icon', 'assets/dual_bullet_icon.png');
  this.load.image('bullet_icon', 'assets/bullet_icon.png');
  this.load.image('back_btn', 'assets/back_btn.png');
}

var gridTable;

function create() {
  var ctx = this;
  storage.loadData();
  console.log("mechanic scene");

  var back_btn = this.add.image(80, 80, 'back_btn');

  back_btn.setInteractive()
    .on('pointerover', function () {
      //back_btn.setTexture("play_btn_hover");
    })
    .on('pointerdown', function () {
      //back_btn.setTexture("play_btn_pressed");
    })
    .on('pointerup', function () {
      //back_btn.setTexture('play_btn_hover');
      ctx.scene.start('menu_scene');

    })
    .on('pointerout', function () {
      //back_btn.setTexture("play_btn");
    });
  coinsText = this.add.text(10,10, 'Coins: ' + storage.getCoins(), {
    font: '16px Courier',
    fill: '#00ff00'
  });


  gridTable = this.rexUI.add.gridTable({
    x: 500,
    y: 300,

    background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x494949),

    table: {
      width: 600,
      height: config.height - 300,

      cellWidth: 300,
      cellHeight: 60,
      columns: 2,
    },
    slider: {
      track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x797979),
      thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0xa9a9a9),
    },

    createCellContainerCallback: function (cell) {
      var scene = cell.scene,
        width = cell.width,
        height = cell.height,
        item = cell.item,
        index = cell.index;
      var itemIcon = scene.add.image(0, 0, item.icon);
      itemIcon.setScale(1 / 2);
      itemIcon.height = itemIcon.height/2;
      itemIcon.width = itemIcon.width/2;
      return scene.rexUI.add.label({
        width: width,
        height: height,

        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, 0x191919),
        icon: itemIcon,
        text: scene.add.text(0, 0, item.name),

        space: {
          icon: 10,
          left: 15
        }
      })
        .setOrigin(0)
        .layout();
    },
    items: getItems(500)
  }).layout();

  //.drawBounds(this.add.graphics(), 0xff0000);


  ctx.print = ctx.add.text(0, 0, '');
  gridTable
    .on('cell.click', function (cellContainer, cellIndex) {
      //ctx.print.text += cellIndex + ': ' + cellContainer.text + '\n';
      console.log(gridTable.items[cellIndex]);
      if(gridTable.items[cellIndex].hasOwnProperty("click_action")){
        console.log("calling click action");
        gridTable.items[cellIndex]["click_action"]();
      }
    }, ctx)
    .on('cell.over', function (cellContainer, cellIndex) {
      var background = cellContainer.getElement('background');
      background.setStrokeStyle(1, 0xffffff);
      background._depthSave = background.depth;
      background.depth++;
    }, ctx)
    .on('cell.out', function (cellContainer, cellIndex) {
      var background = cellContainer.getElement('background');
      background.setStrokeStyle(2, 0x260e04);
      background.depth = background._depthSave;
    }, ctx)



}

var getItems = function (count) {
  var data = [];


  data.push({name: "Click items in this\ncolumn to purchase"});
  data.push({name: "Current Values"});

  data.push({
    name: "Extra Life | Price: " + prices.extra_lives,
    icon: "ship",
    click_action: function(){storage.purchase('extra_lives');refreshUI();}
  });
  data.push({name: "Current: " + storage.getLives(), icon: "ship"});

  data.push({
    name: "Dual Laser | Price: " + prices.dual_lasers,
    icon: "dual_bullet_icon",
    click_action: function(){storage.purchase('dual_lasers');refreshUI();}
  });
  data.push({name: "Enabled: " + storage.getDualLasersEnabled(), icon: "dual_bullet_icon"});

  data.push({
    name: "Max Bullets | Price: " + prices.max_bullets,
    icon: "bullet_icon",
    click_action: function(){storage.purchase('max_bullets');refreshUI();}
  });
  data.push({name: "Current: " + storage.getMaxBullets(), icon: "bullet_icon"});

  data.push({
    name: "Bullet Speed | Price: " + prices.bullet_speed,
    icon: "bullet_icon",
    click_action: function(){storage.purchase('bullet_speed');refreshUI();}
  });
  data.push({name: "Current: " + storage.getBulletSpeed(), icon: "bullet_icon"});

  return data;
};

function refreshUI(){
  //console.log(gridTable.items);
  gridTable.items[1]["name"] = "Current: " + storage.getLives();
  gridTable.items[3]["name"] = "Enabled: " + storage.getDualLasersEnabled();
  gridTable.items[5]["name"] = "Current: " + storage.getMaxBullets();
    gridTable.items[7]["name"] = "Current: " + storage.getBulletSpeed();
  gridTable.setItems(gridTable.items);
  coinsText.setText('Coins: ' + storage.getCoins());
}

function update() {


}

