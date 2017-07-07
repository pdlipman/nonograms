/* globals __DEV__ */
/* eslint-disable */
import Phaser from 'phaser'
/* eslint-enable */
import Mushroom from '../../assets/sprites/Mushroom';
import {
    getLocalized,
    defaultTextStyle,
} from '../../utils';

export default class Game extends Phaser.State {
    create() {
        const bannerText = getLocalized('game.title');
        const optionStyle = defaultTextStyle(40);
        const banner = this.add.text(
            this.world.centerX,
            100,
            bannerText,
            optionStyle);
        banner.anchor.setTo(0.5);

        this.mushroom = new Mushroom({
            game: this,
            x: this.world.centerX,
            y: this.world.centerY,
            asset: 'mushroom',
        });

        this.game.add.existing(this.mushroom);
        // this.state.start('PicrossLevel');
        this.state.start('WorldLevel');
    }

    render() {
        if (__DEV__) {
            this.game.debug.spriteInfo(this.mushroom, 32, 32);
        }
    }
}
