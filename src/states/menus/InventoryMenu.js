/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */

import {
    getLocalized,
    defaultTextStyle,
} from '../../utils';

export default class InventoryMenu {
    constructor(game) {
        this.game = game;
        this.closed = true;

        const inventoryText = getLocalized('inventoryMenu.inventory');
        const optionStyle = defaultTextStyle(40);
        const inventoryLabel = game.add.text(
            0,
            0,
            inventoryText,
            optionStyle);
        inventoryLabel.anchor.setTo(0.5);

        inventoryLabel.inputEnabled = true;
        inventoryLabel.position.setTo(
            game.camera.width - inventoryLabel.width - 50,
            game.camera.height - inventoryLabel.height,
        );

        inventoryLabel.fixedToCamera = true;
        inventoryLabel.events.onInputUp.add(this.toggleInventoryMenu, this);
    }

    toggleInventory() {

    }

    overlap() {

    }
}
