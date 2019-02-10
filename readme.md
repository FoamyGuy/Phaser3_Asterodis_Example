# Phaser 3 Asteroids Game

#### Menu
![Game Screenshot](https://github.com/FoamyGuy/Phaser3_Asterodis_Example/blob/master/screenshot_menu.PNG?raw=true)
#### Game
![Game Screenshot](https://github.com/FoamyGuy/Phaser3_Asterodis_Example/blob/master/screenshot_game.PNG?raw=true)
#### Mechanic
![Game Screenshot](https://github.com/FoamyGuy/Phaser3_Asterodis_Example/blob/master/screenshot_mechanic.PNG?raw=true)
### Getting Started 
This project serves as a basic example for a Phaser 3 asteroids game.

It includes a main menu, a mechanic shop to upgrade your ship, and the game itself. The game was adapted from this [asteroids movement example](http://labs.phaser.io/view.html?src=src\physics\arcade\asteroids%20movement.js), as well as this [firstgame example](http://labs.phaser.io/view.html?src=src\games\firstgame\part10.js)

You need to serve index.html from a webserver. I use python 3 like this:

    python3 -m http.server
    
You can use node.js or some other webserver if you like.
    
Then you can access  the page in the browser at `http://localhost:8000`.
 
##### Game Controls:
* Arrow keys or WASD - Movement. (Down and S do nothing by default).
* Spacebar - Shoot laser.

### Technical Details

This can also serve as a basic "seed" example for creating your own game using static files only, foregoing node.js, imports, or any other build tools. Just swap out `game.js` with yours and modify `menu.js`. If you add new scenes remember to link them in the `index.html` and `script.js`.

The entire ship mechanic system is backed by localstorage so the infmoration is preserved for you even if you close the page and come back. See [storage.js](), and [mechanic.js]().

The mechanic scene requires [rexuiplugins](https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js), specifically the `gridTable`.

### Practice Challenges

If you are looking for practice programming here are a few challenges you can attempt for practice:

* Make the ship fly faster. Bonus points: Add a boost item to the mechanic shop that makes the ship faster the more of them you purchase.
* Spawn more asteroids. Bonus points: Keep track of levels and spawn additional asteroids based on current level.
* Examine and change the medium and small asteroid spawning behavior when they are hit by the lasers.
* Add a way to shoot more than 2 lasers
* Add enemy ships that fly around and shoot at the player.
* Implement mouse controls so you can aim and fire using the mouse pointer.
* Implement brakes or reverse thrusters that slow down the ship when player preses down arrow or S key.

### Thank you

 * [Phaser](https://www.phaser.io/)
 * [Kenny Game Assets](https://www.kenney.nl/assets)
 * [rexuiplugins](https://phaser.discourse.group/t/phaser-3-rexui-plugins/)
 