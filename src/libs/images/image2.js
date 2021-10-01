import {FPS, globalSeed, LOOP_ANIMATION, setLoopAnimation} from "../global";
import {getVector, map, randomIntNumber, rotateVector} from "../utils/functions";
import Image from "./base-image";
import PerlinNoise from "../utils/perlin-noise";
import {getRandBySeed} from "../utils/random";

const STEPS_TO_MOVE = 0.01;

const X_STEPS_IN_IMAGE = 1;
const STEPS_NOISE = 0.005;

export class Image2 extends Image {

  constructor(width, height) {
    super(width, height);
    this.currentPosition = 0;

    /** @member {function} */
    this.noise = PerlinNoise.getNoiseSeed(globalSeed, 10);

    /** @member {function} */
    this.rand = getRandBySeed(globalSeed);

    this.nt = 0;

    this.encoder = new GIFEncoder();
    this.encoder.setRepeat(0);
    this.encoder.setDelay(1000 / 20);
    this.encoder.setQuality(1);
    this.encoder.start();

    this.time = 0;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.time++;

    if (!this.firstTime) {
      this.fillBackground(context);
    }
    this.firstTime = true;

    // this.gout(this.width / 4, this.height / 4, context, 0.5);
    // this.gout(this.width / 4 * 3, this.height / 4, context, 0.5);
    // this.gout(this.width / 4, this.height / 4 * 3, context, 0.5);
    // this.gout(this.width / 4 * 3, this.height / 4 * 3, context, 0.5);

    let colors = ["D741A7", "3A1772", "5398BE", "F2CD5D", "DEA54B"];
    // let colors = ["cbff8c","e3e36a","c16200","881600","4e0110"];
    // let colors = ["2c6e49","4c956c","fefee3","ffc9b9","d68c45"];
    // let colors = ["3d2645", "832161", "da4167", "f0eff4"];

    colors = colors.map(color => `#${color}`)

    // context.strokeStyle = "#D741A7";
    // context.moveTo(this.width * this.noise(0), this.height * this.noise(10))
    // for (let i = 0, nt = 0; i < 1000; i++, nt += 0.01) {
    const xPos = this.width * this.noise(this.nt);
    const yPos = this.height * this.noise(this.nt + 10);

    this.nt += 0.5;

    // context.lineTo(xPos, yPos);

    // const xPos = this.width * this.rand();
    // const yPos = this.height * this.rand();
    const color = this.reduceOpacity(colors[Math.floor(this.rand() * colors.length)], 245);
    this.gout(xPos, yPos, context, map(this.noise(this.nt + 100), 0, 1, 0.5, 0.7), color);
    // this.gout(this.width / 2, this.height / 2, context, 0.3, color);
    // }
    // context.stroke();

    if (this.time / FPS >= 2) {
      setLoopAnimation(false);
      this.encoder.finish();
      context.canvas.onclick = () => {
        this.encoder.download(`img-${globalSeed}.gif`);
      }
    } else {
      this.encoder.addFrame(context);
    }
  }

  /**
   * @param color {string}
   * @param extract {number}
   * @returns {string}
   */
  reduceOpacity(color, extract) {
    let alpha = this.getOpacity(color);
    alpha = Math.min(255, Math.max(alpha - extract, 0));
    alpha = alpha.toString(16);
    return `#${color.substr(1, 6)}${(alpha.length < 2 ? "0" : "") + alpha}`;
  }

  /**
   * @param color {string}
   * @return {number}
   */
  getOpacity(color) {
    return color.length > 7 ? parseInt(color.substr(7, 2), 16) : 255;
  }

  /**
   * @param x {number}
   * @param y {number}
   * @param context {CanvasRenderingContext2D}
   * @param size {number}
   * @param color {string}
   */
  gout(x, y, context, size, color) {
    for (let i = 0, scale = 0.5; i < 8; i++) {
      this.paintGout(x, y, context, size * scale, color);
      scale *= 0.94;
    }
  }

  /**
   * @param ctx {CanvasRenderingContext2D}
   */
  fillBackground(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.rect(0, 0, this.width, this.height);
    ctx.fill();
  }

  /**
   * @param x {number}
   * @param y {number}
   * @param ctx {CanvasRenderingContext2D}
   * @param scaleFactor
   * @param color {string}
   */
  paintGout(x, y, ctx, scaleFactor, color) {
    const points = this.generateGoutShape();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x * scaleFactor + x, points[0].y * scaleFactor + y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * scaleFactor + x, points[i].y * scaleFactor + y);
    }
    ctx.closePath();
    // ctx.stroke();
    ctx.fill();
  }

  generateGoutShape() {
    let points = [];
    const startPoints = 6;
    const iterations = 7;
    const angle = (Math.PI * 2) / startPoints;
    for (let i = 0; i < startPoints; i++) {
      points.push(rotateVector({x: this.width / 2, y: 0}, angle * i));
    }
    for (let i = 0; i < iterations; i++) {
      const newPoints = [points[0]];
      for (let j = 1; j < points.length; j++) {
        newPoints.push(this.randomMiddlePoint(points[j - 1], points[j]));
        newPoints.push(points[j]);
      }
      newPoints.push(this.randomMiddlePoint(points[points.length - 1], points[0]));
      points = newPoints;
    }
    return points;
  }

  randomMiddlePoint(p1, p2) {
    const mp = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
    const v1 = getVector(p1, p2);
    const v2 = rotateVector(v1, Math.PI / 2);
    const factor = randomIntNumber(3, -2) / 3;
    return {
      x: mp.x + v2.x * factor,
      y: mp.y + v2.y * factor,
      vDir: v2
    };
  }
}
