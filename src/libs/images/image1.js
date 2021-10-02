import {globalSeed} from "../global";
import Image from "./base-image";
import PerlinNoise from "../utils/perlin-noise";

const STEPS_TO_MOVE = 0.009;

const X_STEPS_IN_IMAGE = 1;
const STEPS_NOISE = 0.0001;

export class Image1 extends Image {

  constructor(width, height) {
    super(width, height);
    this.currentPosition = 0;

    /** @member {function} */
    this.noise = PerlinNoise.getNoiseSeed(globalSeed);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.fillBackground(context);

    this.paintImage3(context);
  }

  /**
   * @param ctx {CanvasRenderingContext2D}
   */
  fillBackground(ctx) {
    if (this.mark) {
      return
    }
    this.mark = true;
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.rect(0, 0, this.width, this.height);
    ctx.fill();
  }

  /**
   * @param ctx {CanvasRenderingContext2D}
   */
  paintImage(ctx) {
    let xOff = 0;
    for (let i = 0; i < this.width; i++) {
      let yOff = 0;
      for (let j = 0; j < this.height; j++) {

        const grad = Math.floor(this.noise(xOff, yOff) * 255);
        const scale = Math.floor(grad).toString(16);
        ctx.fillStyle = `#${scale}${scale}${scale}`;
        ctx.beginPath();
        ctx.rect(i, j, 1, 1);
        ctx.fill();
        yOff += STEPS_NOISE;
      }
      xOff += STEPS_NOISE;
    }
  }

  paintImage3(ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.53)";
    ctx.beginPath();
    ctx.rect(
      this.width * this.noise(this.currentPosition + STEPS_TO_MOVE),
      this.height * this.noise(this.currentPosition + STEPS_TO_MOVE + 0.42, 3),
      2, 2);
    ctx.fill();
    this.currentPosition += STEPS_TO_MOVE;
  }

  paintImage2(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 1;
    let position = this.currentPosition;
    ctx.moveTo(0, this.height * this.noise(this.currentPosition));
    let xPos = 0;
    while (xPos <= this.width) {
      xPos += X_STEPS_IN_IMAGE;
      position += STEPS_NOISE;
      ctx.lineTo(xPos, this.height * this.noise(position));
    }
    ctx.stroke();
    this.currentPosition += STEPS_TO_MOVE;
  }
}
