/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */
import Lighting from './Lighting';
import Player from '../entities/player/Player';
import PlayerProperties from '../entities/player/PlayerProperties';

import Enemy from '../entities/Enemy';

export default class Level extends Phaser.State {
    preload() {
        this.game.load.tilemap(
            'testLevel',
            'assets/maps/testmap2.json',
            null,
            Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/maps/dungeon_sheet.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.createMap();

        const player = new Player(
            this.game,
            PlayerProperties.position.x,
            PlayerProperties.position.y,
        );
        this.game.camera.follow(player);

        const testEnemy = new Enemy(
            this.game,
            'testEnemy001',
            400,
            100,
            'block',
        );

        this.player = player;
        this.testEnemy = testEnemy;

    }

    createMap() {
        const map = this.game.add.tilemap('testLevel');
        map.addTilesetImage('dungeon_sheet', 'tiles');

        map.createLayer('Floor');
        const collisionLayer = map.createLayer('Collision');

        map.setCollisionBetween(1, 999, true, collisionLayer);

        collisionLayer.resizeWorld();
        this.collisionLayer = collisionLayer;

        this.game.stage.backgroundColor = 0x000000;

        if (map.objects && map.objects.Light) {
            const lightWalls = map.objects.Light;
            this.lighting = new Lighting({ game: this.game, walls: lightWalls });
        }

        map.createLayer('Main');
    }

    update() {
        const {
            collisionLayer,
            game,
            player,
            testEnemy,
        } = this;

        if (this.lighting) {
            this.lighting.update(this.player);
        }

        if (game.physics.arcade.overlap(player, testEnemy) && !PlayerProperties.defeatedEnemies.includes(testEnemy.id)) {
            game.state.start('PicrossLevel', true, false, testEnemy.id);
        }

        game.physics.arcade.collide(player, collisionLayer);
    }

    render() {
        this.game.debug.inputInfo(32, 32);
    }

    shutdown() {
        PlayerProperties.position.x = this.player.x;
        PlayerProperties.position.y = this.player.y;
    }
}
