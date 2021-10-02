import {globalSeed} from "../global";
import {getRandBySeed} from "./random";
import {map} from './functions';

export default class PerlinNoise {

  static getNoiseSeed() {
    const noise = new PerlinNoise();
    return noise.rand.bind(noise);
  }

  /**
   * @param time {number}
   * @param time2 {number}
   * @param time3 {number}
   * @return {number}
   */
  rand(time, time2 = undefined, time3 = undefined) {
    if (time3 !== undefined) {
      return this.rand3D(time, time2, time3);
    }
    if (time2 !== undefined) {
      return this.rand2D(time, time2);
    }
    return this.rand2D(time, time);
  }

  /**
   * @param x {number}
   * @param y {number}
   */
  rand2D(x, y) {
    const x0 = Math.floor(x), x1 = x0 + 1;
    const y0 = Math.floor(y), y1 = y0 + 1;

    const i1 = this.interpolate(
      this.dotGridGradient(x0, y0, 0, x, y),
      this.dotGridGradient(x1, y0, 0, x, y),
      x - x0);

    const i2 = this.interpolate(
      this.dotGridGradient(x0, y1, 0, x, y),
      this.dotGridGradient(x1, y1, 0, x, y),
      x - x0);

    return map(this.interpolate(i1, i2, y - y0), -.5, .5, 0, 1);
  }

  /**
   * @param x {number}
   * @param y {number}
   * @param z {number}
   */
  rand3D(x, y, z) {
    const x0 = Math.floor(x), x1 = x0 + 1;
    const y0 = Math.floor(y), y1 = y0 + 1;
    const z0 = Math.floor(z), z1 = z0 + 1;

    const i1 = this.interpolate(
      this.dotGridGradient(x0, y0, z0, x, y, z),
      this.dotGridGradient(x1, y0, z0, x, y, z),
      x - x0);

    const i2 = this.interpolate(
      this.dotGridGradient(x0, y1, z0, x, y, z),
      this.dotGridGradient(x1, y1, z0, x, y, z),
      x - x0);

    const j1 = this.interpolate(i1, i2, y - y0)

    const i3 = this.interpolate(
      this.dotGridGradient(x0, y0, z1, x, y, z),
      this.dotGridGradient(x1, y0, z1, x, y, z),
      x - x0);

    const i4 = this.interpolate(
      this.dotGridGradient(x0, y1, z1, x, y, z),
      this.dotGridGradient(x1, y1, z1, x, y, z),
      x - x0);

    const j2 = this.interpolate(i3, i4, y - y0)

    return map(this.interpolate(j1, j2, z - z0), -.5, .5, 0, 1);
  }

  interpolate(a, b, w) {
    return (b - a) * this.fade(w) + a;
  }

  /**
   * @param t {number}
   * @return {number}
   */
  fade(t) {
    return ((6 * t - 15) * t + 10) * t * t * t;
  }

  dotGridGradient(x, y, z, x1, y1, z1 = 0) {
    const grad = this.randomGradient(x, y, z);
    return (grad.x * (x - x1)) + (grad.y * (y - y1) + (grad.z * (z - z1)));
  }

  randomGradient(x, y, z) {
    const r = this.partialRand(globalSeed, x+y-z);
    const a = Math.PI * 2 * r;
    return {x: Math.cos(a), y: Math.sin(a), z: Math.cos(a * 2)};
  }

  /**
   * @param globalSeed
   * @param localSeed
   * @return {function}
   */
  partialRand(globalSeed, localSeed) {
    return getRandBySeed(globalSeed, localSeed)();
  }
}
