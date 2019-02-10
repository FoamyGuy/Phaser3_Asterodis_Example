var game_storage_obj = {};
var storage = {

  loadData: function () {
    game_storage_obj = JSON.parse(localStorage.getItem('game_storage'));
    if (game_storage_obj == null) {
      game_storage_obj = {
        coins: 0,
        total_score: 0,
        extra_lives: 2,
        dual_lasers: false,
        max_bullets: 3,
        bullet_speed: 300
      }
    }
  },
  saveData: function () {
    localStorage.setItem('game_storage', JSON.stringify(game_storage_obj));
  },
  addScore: function (score) {
    game_storage_obj['total_score'] = game_storage_obj['total_score'] + score;
  },
  addCoins: function (coins) {
    game_storage_obj['coins'] = game_storage_obj['coins'] + coins;
  },
  getCoins: function () {
    return Math.floor(game_storage_obj['coins']);
  },
  getMaxBullets: function () {
    return game_storage_obj['max_bullets'];
  },
  getBulletSpeed: function () {
    return game_storage_obj['bullet_speed'];
  },
  subtractItem: function (item, val) {
    if (val == undefined) {
      val = 1;
    }
    game_storage_obj[item] = game_storage_obj[item] - val;
  },
  getLives: function () {
    return game_storage_obj['extra_lives'];
  },
  getDualLasersEnabled: function () {
    return game_storage_obj['dual_lasers'];
  },
  increment: function (item) {
    game_storage_obj[item] = game_storage_obj[item] + 1;
  },
  purchase: function (item) {
    console.log("inside purchase " + this.getCoins() + " - " + prices[item]);

    if (this.getCoins() > prices[item]) {
      console.log("can afford");
      this.subtractItem('coins', prices[item]);

      if (item == "dual_lasers") {
        game_storage_obj['dual_lasers'] = true;
      } else {
        this.increment(item);
      }
      console.log("purchasing " + item);
      console.log(game_storage_obj);
      this.saveData();
    }
  }


};

