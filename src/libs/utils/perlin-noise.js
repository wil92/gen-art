import {globalSeed} from "../global";
import {getRandBySeed} from "./random";
import {map} from './functions';

const noiseLevelDiff = 2;

export default class PerlinNoise {

  /**
   * @param seed {string}
   * @param level {number}
   */
  constructor(seed, level) {
    level = level || 5;
    this.levels = [...new Array(level)]
      .fill(null)
      .map((ignore, i) => Math.pow(noiseLevelDiff, -i));
  }

  /**
   * @param seed
   * @param level {number}
   */
  static getNoiseSeed(seed, level = 5) {
    const noise = new PerlinNoise(seed, level);
    return noise.rand.bind(noise);
  }

  /**
   * @param time {number}
   * @param size {number}
   * @return {{r: number, l: number}}
   */
  getBorders(time, size) {
    let l = Math.floor(time / size) * size;
    return {l, r: l + size};
  }

  /**
   * @param globalSeed
   * @param localSeed
   * @return {function}
   */
  partialRand(globalSeed, localSeed) {
    const r = getRandBySeed(globalSeed, localSeed);
    const iterations = Math.floor(localSeed * 100) % 19 + 2;
    return [...new Array(iterations)].fill(null).reduce(() => r());
  }

  /**
   * @param time {number}
   * @param real {number}
   * @return {number}
   */
  evalTime(time, real= undefined) {
    return real || this.partialRand(globalSeed, time);
  }

  /**
   * @param t {number}
   * @return {number}
   */
  fade(t) {
    const t3 = t * t * t;
    return 6 * t3 * t * t - 15 * t3 * t + 10 * t3 - t;
  }

  /**
   * @param i {number}
   * @param j {number}
   * @param p {number}
   * @param fi {number}
   * @param fj {number}
   * @return {number}
   */
  evalInterval(i, j, p, fi, fj) {
    const m = (this.evalTime(j, fj) - this.evalTime(i, fi)) / (j - i);
    const n = this.evalTime(j, fj) - m * j;
    const f = this.fade(map(Math.abs(p - i), 0, Math.abs(j - i), 0, 1));
    const d = Math.sqrt(Math.pow(j - i, 2) + Math.pow(fj - fi, 2));
    return (m * p + n) + map(f, 0, 1, 0, d / 2);
  }

  /**
   * @param time {number}
   * @return {number}
   */
  rand(time) {
    let borders = this.getBorders(time, this.levels[0]);
    let left = borders.l, right = borders.r;
    let vl = this.evalTime(left), vr = this.evalTime(right);

    for (let i = 1; i < this.levels.length; i++) {
      let {l, r} = this.getBorders(time, this.levels[i])

      let tvl = vl, tvr = vr;
      const w = 1 / Math.pow(2, i);
      if (l !== left) {
        tvl = this.evalInterval(left, right, l, vl, vr) + this.evalTime(l) * w - w / 2;
        left = l;
      }
      if (r !== right) {
        tvr = this.evalInterval(left, right, r, vl, vr) + this.evalTime(r) * w - w / 2;
        right = r;
      }
      vl = Math.min(1, Math.max(0, tvl));
      vr = Math.min(1, Math.max(0, tvr));
    }
    return Math.min(1, Math.max(0, this.evalInterval(left, right, time, vl, vr)));
  }
}
