import {globalMod} from "../global";
import {hash} from './hash'

export function getRandBySeed(seed, localSeed = "0") {
  const m = globalMod;
  const a = 48271;
  const c = 0;
  let currentValue = (hash(seed) * hash(localSeed)) % m;
  return function () {
    currentValue = (a * currentValue + c) % m;
    return currentValue / m;
  };
}
