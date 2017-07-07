/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */
import { centerGameObjects } from '../../utils';

export default class Splash extends Phaser.State {
    preload() {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
        centerGameObjects([this.loaderBg, this.loaderBar]);

        this.load.setPreloadSprite(this.loaderBar);
        //
        // load your assets
        //
        this.load.image('mushroom', 'assets/images/mushroom2.png');
        this.load.image('picrossTile', 'assets/images/picross/block.png');
        this.load.image('block', 'assets/images/picross/block.png');
        this.load.image('light', 'assets/images/world/light.png');
        this.load.image('crosshair0', 'assets/images/world/crosshair0.png');
        this.load.image('crosshair6', 'assets/images/world/crosshair6.png');
        this.load.image('crosshair8', 'assets/images/world/crosshair8.png');
    }

    create() {
        // this.state.start('MainMenu');
        this.state.start('Game');
    }
}
