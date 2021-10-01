export default class Image {

  /**
   * @param width {number}
   * @param height {number}
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  setCanvasSize(context) {
    context.canvas.width = this.width;
    context.canvas.height = this.height;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
  }

}
