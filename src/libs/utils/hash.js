import {globalMod} from "../global";

const prime = 571;

export function hash(value) {
  const v = "N@34" + value;
  let result = 0, pot = 1;
  for (let i = 0; i < v.length; i++) {
    result = (result + v.charCodeAt(i) * pot) % globalMod;
    pot = (pot * prime) % globalMod;
  }
  return result;
}
