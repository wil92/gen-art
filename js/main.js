let ctx;
const width = 200;
const height = 200;

const globalMod = ~(1 << 31);
let globalSeed = new Date().getTime();
console.log('global seed:', globalSeed);

let xxx = 0;
let sxx = 0.01;
let sx = 1;

function readConfig() {
  const c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  const vai = document.getElementById("value");
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

window.a = 0;

const noiseLevelDiff = 2;

function getNoiseSeed(seed, level = 5) {
  level = level || 10;
  const levels = [...new Array(level)]
    .fill(null)
    .map((ignore, i) => Math.pow(noiseLevelDiff, -i));
  window.a < 2 && console.log(levels);
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

    window.a < 2 && console.log([...new Array(level - 1)]
      .fill(null)
      .map((ignore, i) => 1 / Math.pow(5, i + 1)));
    window.a < 2 && console.log('time', time);
    for (let i = 1; i < levels.length; i++) {
      let {l, r} = getBorders(time, levels[i])

      let tvl = vl, tvr = vr;
      const w = 1 / Math.pow(5, i + 1);
      window.a < 2 && console.log('ll', l, left);
      if (l !== left) {
        left = l;
        tvl = evalInterval(left, right, l, vl, vr) + evalTime(left) * w - w / 2;
        window.a < 4 && console.log('-l-', evalTime(left) * w - w / 2, w / 2);
      }
      window.a < 2 && console.log('rr', r, right);
      if (r !== right) {
        right = r;
        tvr = evalInterval(left, right, r, vl, vr) + evalTime(right) * w - w / 2;
        window.a < 4 && console.log('-r-', evalTime(left) * w - w / 2, w / 2);
      }
      // console.log(time, left, right, levels[i])
      vl = Math.min(1, Math.max(0, tvl));
      vr = Math.min(1, Math.max(0, tvr));
    }
    window.a++;
    return Math.min(1, Math.max(0, evalInterval(left, right, time, vl, vr)));
  };
}

for (let i = 0, j = 0; i < 20; i++, j += sxx) {
  console.log(i, partialRand(globalSeed, i));
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
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.rect(0, 0, width, height);
  ctx.fill();

  // noise
  const points = [];
  for (let i = 0; i < width; i++) {
    points.push(null);
  }
  let j = 40;
  for (let i = 0; i < width; i += j) {
    points[i] = partialRand(globalSeed, i) * height;
  }
  points[points.length - 1] = partialRand(globalSeed, points.length - 1) * height;
  for (let i = 0, l = 2; i < 3; i++, l++) {
    j = Math.floor(j / 5);
    for (let k = 0; k < width && j > 0; k += j) {
      const size = height / Math.pow(4, l);
      let curr = partialRand(globalSeed, k) * size - size / 2;
      if (points[k] === null) {
        points[k] = calc(points, k, width) + curr;
      }
      points[k] = Math.min(height, Math.max(0, points[k]));
    }
  }

  for (let i = 0; i < width; i++) {
    if (points[i] === null) {
      points[i] = calc(points, i, width);
    }
  }

  let x = 0;
  ctx.beginPath();
  ctx.strokeStyle = "#000";
  ctx.strokeWidth = "0.5px";
  ctx.moveTo(0, map(points[x], 0, height, height / 2, height));
  while (x <= width) {
    x += 2;
    ctx.lineTo(x, map(points[x], 0, height, height / 2, height));
  }
  ctx.stroke();

  // drawMarkers("#000dff", Math.pow(noiseLevelDiff, -3))
  // drawMarkers("#ffc400", Math.pow(noiseLevelDiff, -2))
  drawMarkers("#f00", Math.pow(noiseLevelDiff, -1))
  drawMarkers("#0f0", Math.pow(noiseLevelDiff, 0))

  const n = getNoiseSeed(globalSeed, 5);
  x = 0;
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.strokeWidth = "1px";
  let xx = xxx;
  ctx.moveTo(0, map(n(xx), 0, 1, 0, height / 2));
  while (x <= width) {
    x += sx;
    xx += sxx;
    ctx.lineTo(x, map(n(xx), 0, 1, 0, height / 2));
  }
  ctx.stroke();
  // xxx += 0.000001;
}

function drawMarkers(color, step) {
  let x = 0;
  let xx = xxx;
  while (x <= width) {
    const ps = map(xx, 0, sxx, 0, sx);
    x = ps;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.strokeWidth = ".1px";
    ctx.moveTo(ps, 0);
    ctx.lineTo(ps, height);
    ctx.stroke();
    xx += step;
  }
}

let lastTime = 0;
const intervalPerSecond = 1000 / 30;

function run(currentTime) {
  if (intervalPerSecond <= currentTime - lastTime) {
    this.lastTime = currentTime;
    render();
    return
  }
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
