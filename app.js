const MAX_ANGLE = 30;

const MIN_WEIGHT = 1;
const MAX_WEIGHT = 10;

let state = {
  objects: [],
  angle: 0,
  nextWeight: getRandomWeight(),
}

function getRandomWeight() {
  return Math.floor(Math.random() * (MAX_WEIGHT - MIN_WEIGHT + 1)) + MIN_WEIGHT;
}