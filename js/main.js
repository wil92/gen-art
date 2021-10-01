let ctx;
let vai
const width = 1920;
const height = 1080;

const globalMod = ~(1 << 31);
let globalSeed = 1633043671972 || new Date().getTime();
console.log('global seed:', globalSeed);

let cont = 0;
let xxx = 0;
let sxx = 0.01;
let sx = 1;

function readConfig() {
  const c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  vai = document.getElementById("value");
  vai.value = sxx + "";
  vai.onchange = () => {
    sxx = +vai.value;
  };
}

function map(value, a, b, c, d) {
  return (d - c) * value / (b - a) + c;
}

function pow(a, b, m = globalMod) {
  if (b === 0) {
    return 1;
  }
  if (b === 1) {
    return a;
  }
  const r = pow(a, Math.floor(b / 2), m);
  return (((r * r) % m) * (b % 2 === 1 ? a : 1)) % m;
}

function hash(value) {
  const v = "NCB@" + value;
  let result = 0;
  for (let i = 0; i < v.length; i++) {
    result = (result + v.charCodeAt(i) * pow(571, i)) % globalMod;
  }
  return result;
}

function getRandBySeed(seed, localSeed = "0") {
  const m = globalMod;
  const a = 48271;
  const c = 0;
  let currentValue = (hash(seed) + hash(localSeed)) % m;
  const rand = function () {
    currentValue = (a * currentValue + c) % m;
    return currentValue / m;
  }
  return rand;
}

function partialRand(globalSeed, localSeed) {
  const r = getRandBySeed(globalSeed, localSeed);
  const iterations = Math.floor(localSeed * 100) % 19 + 2;
  return [...new Array(iterations)].fill(null).reduce(() => r());
}

const noiseLevelDiff = 2;

function getNoiseSeed(seed, level = 5) {
  level = level || 10;
  const levels = [...new Array(level)]
    .fill(null)
    .map((ignore, i) => Math.pow(noiseLevelDiff, -i));
  const getBorders = (time, size) => {
    let l = Math.floor(time / size) * size;
    return {l, r: l + size};
  }
  const evalTime = (time, real) => {
    return real || partialRand(globalSeed, time);
  };
  const evalInterval = (i, j, p, fi, fj) => {
    const m = (evalTime(j, fj) - evalTime(i, fi)) / (j - i);
    const n = evalTime(j, fj) - m * j;
    return m * p + n;
  };
  return function (time) {
    let borders = getBorders(time, levels[0]);
    let left = borders.l, right = borders.r;
    let vl = evalTime(left), vr = evalTime(right);

    for (let i = 1; i < levels.length; i++) {
      let {l, r} = getBorders(time, levels[i])

      let tvl = vl, tvr = vr;
      const w = 1 / Math.pow(2, i);
      if (l !== left) {
        tvl = evalInterval(left, right, l, vl, vr) + evalTime(l) * w - w / 2;
        left = l;
      }
      if (r !== right) {
        tvr = evalInterval(left, right, r, vl, vr) + evalTime(r) * w - w / 2;
        right = r;
      }
      vl = Math.min(1, Math.max(0, tvl));
      vr = Math.min(1, Math.max(0, tvr));
    }
    return Math.min(1, Math.max(0, evalInterval(left, right, time, vl, vr)));
  };
}

function calc(arr, p, limit) {
  let i = p, j = p;
  while (i > 0 && arr[i] === null) i--;
  while (j < limit && arr[j] === null) j++;

  const m = (arr[j] - arr[i]) / (j - i);
  const n = arr[j] - m * j;
  return m * p + n;
}

function render() {
  if (!window.x) {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.rect(0, 0, width, height);
    ctx.fill();
  }
  window.x = true;

  // noise
  // const points = [];
  // for (let i = 0; i < width; i++) {
  //   points.push(null);
  // }
  // let j = 40;
  // for (let i = 0; i < width; i += j) {
  //   points[i] = partialRand(globalSeed, i) * height;
  // }
  // points[points.length - 1] = partialRand(globalSeed, points.length - 1) * height;
  // for (let i = 0, l = 2; i < 3; i++, l++) {
  //   j = Math.floor(j / 5);
  //   for (let k = 0; k < width && j > 0; k += j) {
  //     const size = height / Math.pow(4, l);
  //     let curr = partialRand(globalSeed, k) * size - size / 2;
  //     if (points[k] === null) {
  //       points[k] = calc(points, k, width) + curr;
  //     }
  //     points[k] = Math.min(height, Math.max(0, points[k]));
  //   }
  // }
  //
  // for (let i = 0; i < width; i++) {
  //   if (points[i] === null) {
  //     points[i] = calc(points, i, width);
  //   }
  // }
  //
  // let x = 0;
  // ctx.beginPath();
  // ctx.strokeStyle = "#000";
  // ctx.strokeWidth = "0.5px";
  // ctx.moveTo(0, map(points[x], 0, height, height / 2, height));
  // while (x <= width) {
  //   x += 2;
  //   ctx.lineTo(x, map(points[x], 0, height, height / 2, height));
  // }
  // ctx.stroke();

  // drawMarkers("#000dff", Math.pow(noiseLevelDiff, -3))
  // drawMarkers("#ffc400", Math.pow(noiseLevelDiff, -2))
  // drawMarkers("#f00", Math.pow(noiseLevelDiff, -1))
  // drawMarkers("#0f0", Math.pow(noiseLevelDiff, 0))

  // const n = getNoiseSeed(globalSeed, 5);
  // x = 0;
  // ctx.beginPath();
  // ctx.strokeStyle = "#000000";
  // ctx.strokeWidth = "1px";
  // let xx = xxx;
  // ctx.moveTo(0, map(n(xx), 0, 1, 0, height / 2));
  // while (x <= width) {
  //   x += sx;
  //   xx += sxx;
  //   ctx.lineTo(x, map(n(xx), 0, 1, 0, height / 2));
  // }
  // ctx.stroke();


  const n = getNoiseSeed(globalSeed, 6);

  ctx.beginPath();
  ctx.strokeStyle = "rgba(28,50,80,0.05)";
  ctx.lineWidth = 1200;
  ctx.moveTo(map(n(xxx), 0, 1, 0, width), map(n(xxx + 10), 0, 1, 0, height));
  xxx += 0.5;
  ctx.lineTo(map(n(xxx), 0, 1, 0, width), map(n(xxx + 10), 0, 1, 0, height));
  ctx.stroke();

  cont++;
  vai.value = cont;

  // let xoff = 0, yoff = 0;
  // for (let i = 0; i < width / 2; i++) {
  //   xoff = 0;
  //   for (let j = 0; j < height / 2; j++) {
  //     const col = Math.floor(map(n(xoff * yoff), 0, 1, 0, 255));
  //     ctx.beginPath()
  //     ctx.fillStyle = `#${col.toString(16)}${col.toString(16)}${col.toString(16)}ff`;
  //     ctx.rect(i * 2, j * 2, 2, 2);
  //     ctx.fill();
  //     xoff += sxx;
  //   }
  //   yoff += sxx;
  // }
}

let lastTime = 0;
const intervalPerSecond = 1000 / 1000;

function run(currentTime) {
  if (intervalPerSecond <= currentTime - lastTime) {
    this.lastTime = currentTime;
    render();
    // return
  }
  if (cont === 50) return;
  requestAnimationFrame(run);
}

function start() {
  readConfig();
  run();
}

module.exports = {
  hash,
  pow,
  getRandBySeed,
  getNoiseSeed
}
