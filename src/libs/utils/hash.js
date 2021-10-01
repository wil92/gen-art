import {globalMod} from "../global";
import {pow} from "./functions";

export function hash(value) {
  const v = "N" + value;
  let result = 0;
  for (let i = 0; i < v.length; i++) {
    result = (result + v.charCodeAt(i) * pow(571, i)) % globalMod;
  }
  return result;
}
