/* eslint-disable */
import Phaser from 'phaser';
/* eslint-enable */

export default class Lighting {
    constructor({ game, walls }) {
        this.game = game;
        this.walls = walls;
        this.create();
    }

    create() {
        this.light = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'block');
        this.light.renderable = false;

        this.light.anchor.setTo(0.5, 0.5);
        this.bitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);

        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';

        const lightBitmap = this.game.add.image(0, 0, this.bitmap);
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        this.game.input.onTap.add(this.toggleRays, this);

        this.rayBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
        this.rayBitmapImage.visible = false;

        this.LIGHT_RADIUS = 150;
        this.shadowTexture =
            this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        const lightSprite = this.game.add.image(0, 0, this.shadowTexture);

        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    }

    updateShadowTexture() {
        // This function updates the shadow texture (this.shadowTexture).
        // First, it fills the entire texture with a dark shadow color.
        // Then it draws a white circle centered on the pointer position.
        // Because the texture is drawn to the screen using the MULTIPLY
        // blend mode, the dark areas of the texture make all of the colors
        // underneath it darker, while the white area is unaffected.

        const radius = this.LIGHT_RADIUS + this.game.rnd.integerInRange(1, 5);

        // Draw shadow
        this.shadowTexture.context.fillStyle = 'rgb(240, 240, 240)';
        this.shadowTexture.context.fillRect(0, 0, this.game.world.width, this.game.world.height);

        // Draw circle of light with a soft edge
        // Draw circle of light
        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = this.getGradient(radius);
        this.shadowTexture.context.arc(
            this.lightSourceX,
            this.lightSourceY,
            radius,
            0,
            Math.PI * 2);
        this.shadowTexture.context.fill();

        // This just tells the engine it should update the texture cache
        this.shadowTexture.dirty = true;
    }


    update(lightSource) {
        this.lightSourceX = lightSource.x;
        this.lightSourceY = lightSource.y;

        const x1 = this.game.camera.view.x;
        const y1 = this.game.camera.view.y;
        const x2 = x1 + this.game.camera.view.width;
        const y2 = y1 + this.game.camera.view.height;

        this.light.x = this.lightSourceX;
        this.light.y = this.lightSourceY;

        this.bitmap.context.fillStyle = 'rgb(200, 200, 200)';
        this.bitmap.context.fillRect(x1, y1, x2, y2);


        const stageCorners = [
            new Phaser.Point(x1, y1),
            new Phaser.Point(x2, y1),
            new Phaser.Point(x2, y2),
            new Phaser.Point(x1, y2),
        ];
        let points = [];
        let ray = null;
        let intersect = null;
        const currWalls = this.walls;
        currWalls.forEach((wall) => {
            // Create a ray from the light through each corner out to the edge of the stage.
            // This array defines points just inside of each corner to make sure we hit each one.
            // It also defines points just outside of each corner so we can see to the stage edges.
            const wallX1 = wall.x;
            const wallX2 = wall.x + wall.width;
            const wallY1 = wall.y;
            const wallY2 = wall.y + wall.height;

            if (wallX1 < x2 &&
                wallX2 > x1 &&
                wallY1 < y2 &&
                wallY2 > y1
            ) {
                const corners = [
                    new Phaser.Point(wallX1 + 0.1, wallY1 + 0.1),
                    new Phaser.Point(wallX1 - 0.1, wallY1 - 0.1),

                    new Phaser.Point((wallX2) - 0.1, wallY1 + 0.1),
                    new Phaser.Point((wallX2) + 0.1, wallY1 - 0.1),

                    new Phaser.Point((wallX2) - 0.1, (wallY2) - 0.1),
                    new Phaser.Point((wallX2) + 0.1, (wallY2) + 0.1),

                    new Phaser.Point(wallX1 + 0.1, (wallY2) - 0.1),
                    new Phaser.Point(wallX1 - 0.1, (wallY2) + 0.1),
                ];

                // Calculate rays through each point to the edge of the stage
                for (let i = 0; i < corners.length; i++) {
                    const c = corners[i];

                    // Here comes the linear algebra.
                    // The equation for a line is y = slope * x + b
                    // b is where the line crosses the left edge of the stage
                    const slope = (c.y - this.light.y) / (c.x - this.light.x);
                    const b = this.light.y - (slope * this.light.x);

                    let end = null;

                    if (c.x === this.light.x) {
                        // Vertical lines are a special case
                        if (c.y <= this.light.y) {
                            end = new Phaser.Point(this.light.x, y1);
                        } else {
                            end = new Phaser.Point(this.light.x, y2);
                        }
                    } else if (c.y === this.light.y) {
                        // Horizontal lines are a special case
                        if (c.x <= this.light.x) {
                            end = new Phaser.Point(x1, this.light.y);
                        } else {
                            end = new Phaser.Point(x2, this.light.y);
                        }
                    } else {
                        // Find the point where the line crosses the stage edge
                        const left = new Phaser.Point(0, b);
                        const right = new Phaser.Point(
                            this.game.world.width,
                            (slope * this.game.world.width) + b);
                        const top = new Phaser.Point(-b / slope, 0);
                        const bottom = new Phaser.Point(
                            (this.game.world.height - b) / slope,
                            this.game.world.height);

                        // Get the actual intersection point
                        if (c.y <= this.light.y && c.x >= this.light.x) {
                            if (top.x >= 0 && top.x <= this.game.width) {
                                end = top;
                            } else {
                                end = right;
                            }
                        } else if (c.y <= this.light.y && c.x <= this.light.x) {
                            if (top.x >= 0 && top.x <= this.game.width) {
                                end = top;
                            } else {
                                end = left;
                            }
                        } else if (c.y >= this.light.y && c.x >= this.light.x) {
                            if (bottom.x >= 0 && bottom.x <= this.game.width) {
                                end = bottom;
                            } else {
                                end = right;
                            }
                        } else if (c.y >= this.light.y && c.x <= this.light.x) {
                            if (bottom.x >= 0 && bottom.x <= this.game.width) {
                                end = bottom;
                            } else {
                                end = left;
                            }
                        }
                    }

                    // Create a ray
                    ray = new Phaser.Line(this.light.x, this.light.y, end.x, end.y);

                    // Check if the ray intersected the wall
                    intersect = this.getWallIntersection(ray);
                    if (intersect) {
                        // This is the front edge of the light blocking object
                        points.push(intersect);
                    } else {
                        // Nothing blocked the ray
                        points.push(ray.end);
                    }
                }
            }
        });

        // Shoot rays at each of the stage corners to see if the corner
        // of the stage is in shadow. This needs to be done so that
        // shadows don't cut the corner.
        for (let i = 0; i < stageCorners.length; i++) {
            ray = new Phaser.Line(this.light.x, this.light.y,
                stageCorners[i].x, stageCorners[i].y);
            intersect = this.getWallIntersection(ray);
            if (!intersect) {
                // Corner is in light
                points.push(stageCorners[i]);
            }
        }

        // Now sort the points clockwise around the light
        // Sorting is required so that the points are connected in the right order.
        //
        // This sorting algorithm was copied from Stack Overflow:
        // http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
        //
        // Here's a pseudo-code implementation if you want to code it yourself:
        // http://en.wikipedia.org/wiki/Graham_scan
        const center = { x: this.light.x, y: this.light.y };
        points = points.sort((a, b) => {
            if (a.x - center.x >= 0 && b.x - center.x < 0) {
                return 1;
            }
            if (a.x - center.x < 0 && b.x - center.x >= 0) {
                return -1;
            }
            if (a.x - center.x === 0 && b.x - center.x === 0) {
                if (a.y - center.y >= 0 || b.y - center.y >= 0) {
                    return 1;
                }
                return -1;
            }

            // Compute the cross product of vectors (center -> a) x (center -> b)
            const det = ((a.x - center.x) * (b.y - center.y))
                - ((b.x - center.x) * (a.y - center.y));

            if (det < 0) {
                return 1;
            }
            if (det > 0) {
                return -1;
            }

            // Points a and b are on the same line from the center
            // Check which point is closer to the center
            // const d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
            // const d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
            return 1;
        });

        // Connect the dots and fill in the shape, which are cones of light,
        // with a bright white color. When multiplied with the background,
        // the white color will allow the full color of the background to
        // shine through.

        this.bitmap.context.beginPath();
        this.bitmap.context.fillStyle = this.getGradient();
        this.bitmap.context.moveTo(points[0].x, points[0].y);
        for (let j = 0; j < points.length; j++) {
            this.bitmap.context.lineTo(points[j].x, points[j].y);
        }
        this.bitmap.context.closePath();
        this.bitmap.context.fill();

        // Draw each of the rays on the rayBitmap
        this.rayBitmap.context.clearRect(x1, y1, x2, y2);
        this.rayBitmap.context.beginPath();
        this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.rayBitmap.context.moveTo(points[0].x, points[0].y);
        for (let k = 0; k < points.length; k++) {
            this.rayBitmap.context.moveTo(this.light.x, this.light.y);
            this.rayBitmap.context.lineTo(points[k].x, points[k].y);
            this.rayBitmap.context.fillRect(points[k].x - 2, points[k].y - 2, 4, 4);
        }
        this.rayBitmap.context.stroke();

        // This just tells the engine it should update the texture cache
        this.bitmap.dirty = true;
        this.rayBitmap.dirty = true;
        this.updateShadowTexture();
    }

    getWallIntersection(ray) {
        let distanceToWall = Number.POSITIVE_INFINITY;
        let closestIntersection = null;

        // For each of the walls...
        this.walls.forEach((wall) => {
            // Create an array of lines that represent the four edges of each wall
            const lines = [
                new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
                new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
                new Phaser.Line(wall.x + wall.width, wall.y,
                    wall.x + wall.width, wall.y + wall.height),
                new Phaser.Line(wall.x, wall.y + wall.height,
                    wall.x + wall.width, wall.y + wall.height),
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for (let i = 0; i < lines.length; i++) {
                const intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    const distance =
                        this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        });

        return closestIntersection;
    }

    toggleRays() {
        // Toggle the visibility of the rays when the pointer is clicked
        if (this.rayBitmapImage.visible) {
            this.rayBitmapImage.visible = false;
        } else {
            this.rayBitmapImage.visible = true;
        }
    }

    getGradient(radius) {
        // Draw circle of light with a soft edge
        const radiusValue = radius || this.LIGHT_RADIUS;
        const gradient = this.shadowTexture.context.createRadialGradient(
            this.lightSourceX,
            this.lightSourceY,
            radiusValue * 0.75,
            this.lightSourceX,
            this.lightSourceY,
            radiusValue);

        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        return gradient;
    }
}
