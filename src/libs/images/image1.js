import {globalSeed} from "../global";
import {map} from "../utils/functions";
import Image from "./base-image";
import PerlinNoise from "../utils/perlin-noise";

const STEPS_TO_MOVE = 0.01;

const X_STEPS_IN_IMAGE = 1;
const STEPS_NOISE = 0.005;

export class Image1 extends Image {

  constructor(width, height) {
    super(width, height);
    this.currentPosition = 0;

    /** @member {function} */
    this.noise = PerlinNoise.getNoiseSeed(globalSeed, 10);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.fillBackground(context);

    this.paintImage(context);
  }

  /**
   * @param ctx {CanvasRenderingContext2D}
   */
  fillBackground(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.rect(0, 0, this.width, this.height);
    ctx.fill();
  }

  /**
   * @param ctx {CanvasRenderingContext2D}
   */
  paintImage(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 1;
    let position = this.currentPosition;
    ctx.moveTo(0, map(this.noise(this.currentPosition), 0, 1, 0, this.height / 2));
    let xPos = 0;
    while (xPos <= this.width) {
      xPos += X_STEPS_IN_IMAGE;
      position += STEPS_NOISE;
      ctx.lineTo(xPos, map(this.noise(position), 0, 1, 0, this.height / 2));
    }
    ctx.stroke();
    this.currentPosition += STEPS_TO_MOVE;
  }
}
