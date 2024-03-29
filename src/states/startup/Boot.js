/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */

import WebFont from 'webfontloader';

export default class Boot extends Phaser.State {
    init() {
        this.stage.backgroundColor = '#000';
        this.fontsReady = false;
        this.fontsLoaded = this.fontsLoaded.bind(this);
    }

    preload() {
        WebFont.load({
            google: {
                families: ['Roboto'],
            },
            active: this.fontsLoaded,
        });

        const text = this.add.text(
            this.world.centerX,
            this.world.centerY,
            'loading fonts',
            {
                font: '16px Arial',
                fill: '#dddddd',
                align: 'center',
            });

        text.anchor.setTo(0.5, 0.5);

        this.load.image('loaderBg', './assets/images/loader-bg.png');
        this.load.image('loaderBar', './assets/images/loader-bar.png');
    }

    render() {
        if (this.fontsReady) {
            this.state.start('Splash');
        }
    }

    fontsLoaded() {
        this.fontsReady = true;
    }
}
