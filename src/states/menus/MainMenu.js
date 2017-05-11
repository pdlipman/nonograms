/* globals __DEV__ */
/* eslint-disable */
import Phaser from 'phaser'
/* eslint-enable */

import {
    getLocalized,
    defaultTextStyle,
} from '../../utils';

export default class MainMenu extends Phaser.State {
    create() {
        const bannerText = getLocalized('mainMenu.title');
        const optionStyle = defaultTextStyle(40);
        const banner = this.add.text(
            this.world.centerX,
            100,
            bannerText,
            optionStyle);
        banner.anchor.setTo(0.5);

        const options = [
            {
                index: 1,
                titleKey: 'mainMenu.start',
                stateName: 'Game',
            },
        ];

        options.forEach((option) => {
            this.addMenuItem(getLocalized(option.titleKey), option.index, () => {
                this.state.start(option.stateName);
            });
        });
    }

    addMenuItem(text, optionCount, callback) {
        const optionStyle = defaultTextStyle();

        const menuText = this.add.text(
            this.world.centerX,
            (optionCount * 30) + 200,
            text,
            optionStyle);

        const onOver = (target) => {
            target.fill = '#feffd5';
            target.stroke = 'rgba(200,200,200,0.5)';
        };

        const onOut = (target) => {
            target.fill = '#fff';
            target.stroke = 'rgba(0,0,0,0)';
        };

        menuText.anchor.setTo(0.5);
        menuText.inputEnabled = true;
        menuText.events.onInputUp.add(callback);
        menuText.events.onInputOver.add(onOver);
        menuText.events.onInputOut.add(onOut);
    }
}
