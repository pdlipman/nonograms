/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */
import Lighting from './Lighting';

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
        const map = this.game.add.tilemap('testLevel');
        map.addTilesetImage('dungeon_sheet', 'tiles');

        const layer = map.createLayer('Collision');

        layer.resizeWorld();

        this.game.stage.backgroundColor = 0x4488cc;
        this.light = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'light');
        this.light.anchor.setTo(0.5, 0.5);

        if (map.objects && map.objects.Light) {
            const lightWalls = map.objects.Light;
            this.lighting = new Lighting({ game: this.game, walls: lightWalls });
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    updateControls() {
        const cursors = this.cursors;

        if (cursors.up.isDown) {
            this.game.camera.y -= 4;
        } else if (cursors.down.isDown) {
            this.game.camera.y += 4;
        }

        if (cursors.left.isDown) {
            this.game.camera.x -= 4;
        } else if (cursors.right.isDown) {
            this.game.camera.x += 4;
        }
    }

    update() {
        this.light.x = this.game.input.mousePointer.worldX;
        this.light.y = this.game.input.mousePointer.worldY;

        this.updateControls();
        if (this.lighting) {
            this.lighting.update();
        }
    }
}
