import {FPS, LOOP_ANIMATION} from "./global";

const intervalPerSecond = 1000 / FPS;
let gameInstance = null;

export default class Animation {

  constructor() {
    /** @member {HTMLCanvasElement} */
    this.canvas = document.getElementById("game");

    /** @member {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext("2d");

    /** @member {Image} */
    this.currentImage = null;

    this.lastTime = 0;
  }

  /**
   * @param image {Image}
   * @return {Animation}
   */
  setImageToPaint(image) {
    this.currentImage = image;
    this.currentImage.setCanvasSize(this.context);
    return this;
  }

  /**
   * @return {Animation}
   */
  static getInstance() {
    if (!gameInstance) {
      gameInstance = new Animation();
    }
    return gameInstance;
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(currentTime) {
    this.currentTime = currentTime;
    if (intervalPerSecond <= currentTime - this.lastTime) {
      this.lastTime = currentTime;

      if (this.currentImage) {
        this.currentImage.render(this.context);
      }

      if (!LOOP_ANIMATION) {
        return;
      }
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}
