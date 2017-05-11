/* eslint-disable */
import 'pixi';
import 'p2';
import Phaser from 'phaser';
/* eslint-enable */

import BootState from './states/startup/Boot';
import SplashState from './states/startup/Splash';
import GameState from './states/main/Game';


import MainMenuState from './states/menus/MainMenu';
// Picross Board
import PicrossLevel from './states/picross/Level';

// World
import WorldLevel from './states/world/Level';

import config from './config';

class Game extends Phaser.Game {
    constructor() {
        const docElement = document.documentElement;
        const width =
            docElement.clientWidth > config.gameWidth
                ? config.gameWidth
                : docElement.clientWidth;
        const height =
            docElement.clientHeight > config.gameHeight
                ? config.gameHeight
                : docElement.clientHeight;

        super(width, height, Phaser.CANVAS, 'content', null);

        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Game', GameState, false);
        this.state.add('MainMenu', MainMenuState, false);

        // Picross Board
        this.state.add('PicrossLevel', PicrossLevel, false);

        // World
        this.state.add('WorldLevel', WorldLevel, false);

        this.state.start('Boot');
    }
}

window.game = new Game();
