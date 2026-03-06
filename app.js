const plankElement = document.querySelector('.plank');
const leftWeightElement = document.querySelector('.left-weight-value');
const rightWeightElement = document.querySelector('.right-weight-value');
const nextWeightElement = document.querySelector('.next-weight-value');
const angleElement = document.querySelector('.angle-value');

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

function handlePlankClick(event) {
  const rect = plankElement.getBoundingClientRect();
  const click = event.clientX - rect.left;
  const plankWidth = rect.width;
  const pivot = plankWidth / 2;
  const distance = click - pivot;

  const weight = state.nextWeight;

  const newObject = {
    position: click,
    distance,
    weight
  }

  state.objects.push(newObject);

  state.nextWeight = getRandomWeight();

  calculatePhysics();
  renderWeights();
  updateInfo();
}

function renderWeights() {
  const existingWeights = document.querySelectorAll('.weight');

  existingWeights.forEach(item => item.remove());

  for (const item of state.objects) {
    const weightElement = document.createElement('div');

    weightElement.classList.add('weight');

    weightElement.style.left = `${item.position}px`;
    weightElement.textContent = item.weight;

    plankElement.append(weightElement);
  }

  plankElement.style.transform = `rotate(${state.angle}deg)`;
}

function calculatePhysics() {
  let leftTorque = 0;
  let rightTorque = 0;
  let leftWeight = 0;
  let rightWeight = 0;

  for (const item of state.objects) {
    const distance = Math.abs(item.distance);
    const torque = distance * item.weight;

    if (item.distance < 0) {
      leftTorque += torque;
      leftWeight += item.weight;
    } else {
      rightTorque += torque;
      rightWeight += item.weight;
    }
  }

  const netTorque = rightTorque - leftTorque;

  const angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, (netTorque / 10)));

  state.angle = angle;

  return { leftWeight, rightWeight };
}

function updateInfo() {
  const { leftWeight, rightWeight } = calculatePhysics();

  leftWeightElement.textContent = `${leftWeight.toFixed(1)} kg`;
  rightWeightElement.textContent = `${rightWeight.toFixed(1)} kg`;
  nextWeightElement.textContent = `${state.nextWeight.toFixed(1)} kg`;
  angleElement.textContent = `${state.angle.toFixed(1)}°`;
}

function init() {
  plankElement.addEventListener('click', handlePlankClick);
}

init();