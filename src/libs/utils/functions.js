import {globalMod, globalSeed} from "../global";
import {getRandBySeed} from "./random";

/**
 * @param a {number}
 * @param b {number}
 * @param m {number}
 * @return {number}
 */
export function pow(a, b, m = globalMod) {
  if (b === 0) {
    return 1;
  }
  if (b === 1) {
    return a;
  }
  const r = pow(a, Math.floor(b / 2), m);
  return (((r * r) % m) * (b % 2 === 1 ? a : 1)) % m;
}

/**
 * Normalize a point between a and b into c and d
 * @param value {number}
 * @param a {number}
 * @param b {number}
 * @param c {number}
 * @param d {number}
 * @return {number}
 */
export function map(value, a, b, c, d) {
  return (d - c) * value / (b - a) + c;
}

/**
 * @param vector {{x: number, y: number}}
 * @param phi {number}
 * @return {{x: number, y: number}}
 */
export function rotateVector(vector, phi) {
  return {
    x: vector.x * Math.cos(phi) - vector.y * Math.sin(phi),
    y: vector.x * Math.sin(phi) + vector.y * Math.cos(phi),
  };
}

/**
 * @param p1 {{x: number, y: number}}
 * @param p2 {{x: number, y: number}}
 * @return {{x: number, y: number}}
 */
export function getVector(p1, p2) {
  return {x: p2.x - p1.x, y: p2.y - p1.y};
}

const randomIntNumberRand = getRandBySeed(globalSeed);
/**
 * @param limit {number}
 * @param start {number}
 * @returns {number}
 */
export function randomIntNumber(limit, start = 0) {
  return Math.floor(randomIntNumberRand() * limit) + start;
}
