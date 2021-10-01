import {globalMod} from "../global";

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

export function map(value, a, b, c, d) {
  return (d - c) * value / (b - a) + c;
}
