export const globalMod = ~(1 << 31);
// export const globalSeed = 1633117805968;
export const globalSeed = Math.floor(new Date().getTime() * Math.random());
console.log('global seed:', globalSeed);

export let LOOP_ANIMATION = true;

// animation
export const FPS = 100;

export function setLoopAnimation(loop) {
  LOOP_ANIMATION = loop;
}
