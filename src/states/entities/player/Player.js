export default class Player extends Phaser.Sprite { // eslint-disable-line no-undef
    constructor(game, x, y) {
        super(game, x, y, 'block');

        this.tint = 0x00ff00;

        game.physics.arcade.enable(this);
        this.body.bounce.y = 0.0;
        this.body.gravity.y = 0;
        this.body.collidWorldBounds = true;
        this.anchor.setTo(0.5, 0.5);
        game.add.existing(this);

        const target = game.add.sprite(
            0,
            0,
            'block',
        );

        game.physics.enable(target);
        target.anchor.setTo(0.5, 0.5);
        target.inputEnabled = true;
        target.scale.setTo(0.1);
        target.renderable = false;

        const crosshair = game.add.sprite(
            0,
            0,
            'crosshair6',
        );
        crosshair.anchor.setTo(0.5, 0.5);

        this.target = target;
        this.crosshair = crosshair;
        this.game = game;
    }

    update() {
        const player = this;
        const {
            target,
            crosshair,
        } = this;

        player.body.velocity.x = 0;

        target.input.enabled = true;
        target.x = this.game.input.mousePointer.worldX;
        target.y = this.game.input.mousePointer.worldY;
        crosshair.x = target.x;
        crosshair.y = target.y;

        this.playerController();
    }

    playerController() {
        const player = this;
        const {
            target,
            game,
        } = this;

        if (this.game.input.activePointer.leftButton.isDown) {
            this.game.physics.arcade.moveToPointer(player, 300);

            if (this.game.physics.arcade.overlap(player, target)) {
                player.body.velocity.setTo(0, 0);
            }
        } else {
            player.body.velocity.setTo(0, 0);
        }
    }
}

module.exports = Player;
