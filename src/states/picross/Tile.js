/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */

export default class Tile extends Phaser.Sprite {
    constructor({ game, column, row, asset, isAnswer, padding, width, height }) {
        super(game, 0, 0, asset);
        this.game = game;
        this.isAnswer = isAnswer;
        this.clicked = false;
        this.disabled = false;

        this.movementDistance = 3;
        this.movementSpeed = 100;

        this.column = column;
        this.row = row;

        this.width = width || game.cache.getImage(asset).width;
        this.height = height || game.cache.getImage(asset).height;

        this.startingX = (this.column * this.width) + (this.column * padding);
        this.startingY = (this.row * this.height) + (this.row * padding);

        this.events.onInputOut.add(this.rollOut, this);
        this.events.onInputOver.add(this.rollOver, this);
        this.events.onInputDown.add(this.click, this);
    }

    initializeControls() {
        this.inputEnabled = true;
    }

    click() {
        if (this.game.input.activePointer.leftButton.isDown) {
            if (this.isAnswer) {
                if (!this.clicked) {
                    console.log('correct!');
                }
                this.tint = 0x00ff00;
            } else {
                this.tint = 0xff0000;
            }

            this.clicked = true;
        }

        if (!this.clicked) {
            if (this.game.input.activePointer.middleButton.isDown) {
                if (this.disabled) {
                    this.tint = 0xffffff;
                } else {
                    this.tint = 0x333333;
                }
                this.disabled = !this.disabled;
            }
        }
    }

    rollOver() {
        const tween = this.game.add.tween(this);
        tween.to(
            {
                x: this.startingX - this.movementDistance,
                y: this.startingY - this.movementDistance,
            },
            this.movementSpeed,
            Phaser.Easing.Exponential.easeOut);
        tween.start();
    }

    rollOut() {
        const tween = this.game.add.tween(this);
        tween.to(
            {
                x: this.startingX,
                y: this.startingY,
            },
            this.movementSpeed,
            Phaser.Easing.Exponential.easeOut); // eslint-disable-line no-undef
        tween.start();
    }
}
