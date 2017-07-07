/* globals __DEV__ */
/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */
import config from '../../config';
import Board from './Board';
import PlayerProperties from '../entities/player/PlayerProperties';

import {
    defaultTextStyle,
    getLocalized,
} from '../../utils';

export default class Level extends Phaser.State {
    init(enemyId) {
        this.enemyId = enemyId;
        this.game.world.width = config.gameWidth;
        this.game.world.height = config.gameHeight;

        this.answerKeyCsv =
            '1,1,1,1,1\n' +
            '1,0,1,0,1\n' +
            '1,1,1,1,1\n' +
            '0,1,1,1,0\n' +
            '0,1,0,1,0';

        this.currentScore = 0;
        this.winningScore = 0;

        this.board = this.initializeBoard();
    }

    create() {

        this.createScoreDisplay();
        this.createWinningScoreDisplay();
        const crosshair = game.add.sprite(
            0,
            0,
            'crosshair6',
        );
        crosshair.anchor.setTo(0.5, 0.5);
        this.crosshair = crosshair;
    }

    render() {
        if (__DEV__) {
            this.game.debug.inputInfo(32, 32);
        }

        const {
            currentScore
        } = this;


        this.score.setText(Level.getScoreText('picrossLevel.score', currentScore));
    }

    update() {
        const {
            crosshair,
            winningScore,
        } = this;

        const tileGroup = this.board.tileGroup.children;
        this.currentScore = tileGroup.filter(tile => tile.clicked && tile.isAnswer).length;
        crosshair.x = this.game.input.mousePointer.worldX;
        crosshair.y = this.game.input.mousePointer.worldY;

        console.log('currentScore: ' + this.currentScore);
        console.log('winningScore: ' + winningScore);
        if (this.currentScore === winningScore) {
            PlayerProperties.defeatedEnemies.push(this.enemyId);
            this.state.start('WorldLevel');
        }
    }

    createScoreDisplay() {
        const optionStyle = defaultTextStyle();
        this.score = this.add.text(
            this.world.centerX,
            (this.world.y + this.world.height) - 60,
            Level.getScoreText('picrossLevel.score', this.currentScore),
            optionStyle);
        this.score.anchor.setTo(0.5);

        const scoreTestKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        scoreTestKey.onDown.add(this.scoreTest, this);
    }

    createWinningScoreDisplay() {
        const optionStyle = defaultTextStyle();
        const winningScore = this.add.text(
            this.world.centerX,
            (this.world.y + this.world.height) - 30,
            Level.getScoreText('picrossLevel.winningScore', this.winningScore),
            optionStyle);
        winningScore.anchor.setTo(0.5);
    }

    static getScoreText(stringKey, score) {
        const label = getLocalized(stringKey);
        return `${label}: ${score}`;
    }

    scoreTest() {
        this.currentScore++;
    }

    initializeBoard() {
        const {
            answerKeyCsv,
        } = this;

        const board = new Board({
            game: this,
            centerX: this.game.world.centerX,
            centerY: this.game.world.centerY,
            answerKeyCsv,
        });

        this.winningScore = (answerKeyCsv.match(/1/g) || []).length;
        return board;
    }

}
