/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */

import Tile from './Tile';
import {
    csvToArray,
    defaultTextStyle,
} from '../../utils';

export default class Board {
    constructor({ game, centerX, centerY, answerKeyCsv }) {
        this.game = game;
        this.centerX = centerX;
        this.centerY = centerY;
        this.tileGroup = game.add.group();
        this.answerKey = csvToArray(answerKeyCsv);

        this.width = this.answerKey[0].length;
        this.height = this.answerKey.length;

        this.tileSet = [];
        this.hintsX = [];
        this.hintsY = [];

        this.tilePadding = 10;

        const promise = new Promise(() => Promise.resolve(this.initializeTiles()));

        promise.then(this.initializeHints()).then(this.loadTiles()).then(this.showHints());
    }

    initializeTiles() {
        for (let y = 0; y < this.height; y++) {
            const tileRow = [];
            for (let x = 0; x < this.width; x++) {
                const tile = new Tile({
                    game: this.game,
                    column: x,
                    row: y,
                    asset: 'picrossTile',
                    isAnswer: this.answerKey[y][x] === '1',
                    padding: this.tilePadding,
                });
                tileRow.push(tile);
                this.tileGroup.add(tile);
            }
            this.tileSet.push(tileRow);
        }
    }

    initializeHints() {
        for (let y = 0; y < this.height; y++) {
            let streak = 0;
            this.hintsX[y] = [];
            for (let x = 0; x < this.width; x++) {
                if (this.answerKey[y][x] === '0') {
                    if (streak > 0) {
                        this.hintsX[y].push(streak);
                    }

                    streak = 0;
                } else {
                    streak += 1;
                }
            }

            if (streak > 0) {
                this.hintsX[y].push(streak);
            }
        }

        for (let x = 0; x < this.width; x++) {
            let streak = 0;
            this.hintsY[x] = [];
            for (let y = 0; y < this.height; y++) {
                if (this.answerKey[y][x] === '0') {
                    if (streak > 0) {
                        this.hintsY[x].push(streak);
                    }

                    streak = 0;
                } else {
                    streak += 1;
                }
            }

            if (streak > 0) {
                this.hintsY[x].push(streak);
            }
        }
    }

    getTileSetPosition() {
        const tileSetX = this.centerX - ((this.tileGroup.children[0].width * this.width) / 2);
        const tileSetY = this.centerY - ((this.tileGroup.children[0].height * this.height) / 2);

        return {
            x: tileSetX,
            y: tileSetY,
        };
    }

    loadTiles() {
        const tileSetPosition = this.getTileSetPosition();
        this.tileGroup.position.setTo(tileSetPosition.x, tileSetPosition.y);
        const board = this;
        board.tileSet.forEach((tileRow) => {
            tileRow.forEach((tile) => {
                tile.position.setTo(tile.startingX, -300);
                const tween = this.game.add.tween(tile);
                tween.to(
                    {
                        x: tile.startingX,
                        y: tile.startingY,
                    },
                    300 + ((board.width - tile.row) * 150) + (tile.column * 150),
                    Phaser.Easing.Exponential.easeOut);
                tween.onComplete.add(tile.initializeControls, tile);
                tween.start();
            });
        });
    }

    showHints() {
        const tileSetPosition = this.getTileSetPosition();
        const parentX = tileSetPosition.x;
        const parentY = tileSetPosition.y;
        const {
            tileSet,
            game,
        } = this;

        const hintStyle = defaultTextStyle(14);
        this.generateHintsXText(game, parentX, parentY, tileSet, hintStyle);
        this.generateHintsYText(game, parentX, tileSet, parentY, hintStyle);
    }

    generateHintsYText(game, parentX, tileSet, parentY, hintStyle) {
        for (let x = 0; x < this.hintsY.length; x++) {
            let hintYText = '';
            for (let i = 0; i < this.hintsY[x].length; i++) {
                hintYText += this.hintsY[x][i];
                if (i + 1 < this.hintsY[x].length) {
                    hintYText += '\n';
                }
            }
            const text =
                game.add.text(
                    parentX + tileSet[0][x].startingX + (this.tileGroup.children[0].width / 2),
                    parentY,
                    hintYText,
                    hintStyle);
            text.anchor.setTo(0.5, 1);
            text.alpha = 0.0;
            game.add.tween(text).to({ alpha: 1 }, 3000, 'Linear', true);
        }
    }

    generateHintsXText(game, parentX, parentY, tileSet, hintStyle) {
        for (let y = 0; y < this.hintsX.length; y++) {
            let hintXText = '';
            for (let i = 0; i < this.hintsX[y].length; i++) {
                hintXText += this.hintsX[y][i];
                if (i + 1 < this.hintsX[y].length) {
                    hintXText += ' ';
                }
            }

            const text =
                game.add.text(parentX - this.tilePadding,
                    parentY + tileSet[y][0].startingY + this.tilePadding,
                    hintXText,
                    hintStyle);
            text.anchor.setTo(1, 0);
            text.alpha = 0.0;
            game.add.tween(text).to({ alpha: 1 }, 3000, 'Linear', true);
        }
    }
}
