const plankElement = document.querySelector('.plank');
const leftWeightElement = document.querySelector('.left-weight-value');
const rightWeightElement = document.querySelector('.right-weight-value');
const nextWeightElement = document.querySelector('.next-weight-value');
const angleElement = document.querySelector('.angle-value');
const resetButton = document.querySelector('.btn');

const STORAGE_KEY = 'seesaw-state';

const MAX_ANGLE = 30;

const MIN_WEIGHT = 1;
const MAX_WEIGHT = 10;

const SMALL_WEIGHT = 3;
const MEDIUM_WEIGHT = 7;

let state = {
  objects: [],
  angle: 0,
  nextWeight: getRandomWeight(),
}

let previewWeight = null;

let distanceLine = null;
let distanceLabel = null;

function getRandomWeight() {
  return Math.floor(Math.random() * (MAX_WEIGHT - MIN_WEIGHT + 1)) + MIN_WEIGHT;
}

function getWeightClass(weight) {
  if (weight <= SMALL_WEIGHT) return 'weight-small';
  if (weight <= MEDIUM_WEIGHT) return 'weight-medium';
  return 'weight-large';
}

function handlePlankClick(event) {
  const click = event.offsetX;
  const plankWidth = plankElement.clientWidth;
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

  if (previewWeight) {
    previewWeight.textContent = state.nextWeight;
    previewWeight.classList.add(getWeightClass(state.nextWeight));
  }

  calculatePhysics();
  renderWeights(newObject);
  updateInfo();
  saveLocalStorage();
}

function handlePlankMove(event) {
  const position = event.offsetX;
  const plankWidth = plankElement.clientWidth;
  const pivot = plankWidth / 2;
  const from = Math.min(pivot, position);
  const to = Math.max(pivot, position);
  const middle = (from + to) / 2;
  const distance = Math.abs(position - pivot);

  if (position < 0 || position > plankWidth) {
    if (previewWeight) previewWeight.style.display = 'none';
    if (distanceLine) distanceLine.style.display = 'none';
    if (distanceLabel) distanceLabel.style.display = 'none';
    return;
  }

  if (!previewWeight) {
    previewWeight = document.createElement('div');
    previewWeight.classList.add('weight', 'weight-preview');
    plankElement.append(previewWeight);
  }

  if (!distanceLine) {
    distanceLine = document.createElement('div');
    distanceLine.className = 'distance-line';
    plankElement.append(distanceLine);
  }

  if (!distanceLabel) {
    distanceLabel = document.createElement('div');
    distanceLabel.className = 'distance-label';
    plankElement.append(distanceLabel);
  }

  distanceLine.style.display = 'block';
  distanceLine.style.left = `${from}px`;
  distanceLine.style.width = `${to - from}px`;

  distanceLabel.style.display = 'block';
  distanceLabel.style.left = `${middle}px`;
  distanceLabel.textContent = `${distance} px`;

  previewWeight.style.display = 'flex';
  previewWeight.style.left = `${position}px`;
  previewWeight.textContent = state.nextWeight;
  previewWeight.className = `weight weight-preview ${getWeightClass(state.nextWeight)}`;
}

function handlePlankLeave() {
  if (previewWeight) previewWeight.style.display = 'none'
  if (distanceLine) distanceLine.style.display = 'none';
  if (distanceLabel) distanceLabel.style.display = 'none';
}

function handleReset() {
  state.objects = [];
  state.angle = 0;
  state.nextWeight = getRandomWeight();
  plankElement.style.transform = 'rotate(0deg)';

  renderWeights();
  updateInfo();

  localStorage.removeItem(STORAGE_KEY);
}

function renderWeights(lastAdded = null) {
  const existingWeights = document.querySelectorAll('.weight:not(.weight-preview)');

  existingWeights.forEach(item => item.remove());

  for (const item of state.objects) {
    const weightElement = document.createElement('div');

    weightElement.classList.add('weight');
    weightElement.classList.add(getWeightClass(item.weight));

    if (lastAdded && item === lastAdded) {
      weightElement.classList.add('weight-drop');
    }

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

function saveLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);

    state.objects = Array.isArray(parsed.objects) ? parsed.objects : [];
    state.angle = typeof parsed.angle === 'number' ? parsed.angle : 0;
    state.nextWeight = typeof parsed.nextWeight === 'number' ? parsed.nextWeight : getRandomWeight();
  } catch (error) {
    console.error('Error loading data from local storage:', error);
  }
}

function init() {
  loadLocalStorage();

  calculatePhysics();
  renderWeights();
  updateInfo();

  plankElement.addEventListener('click', handlePlankClick);
  plankElement.addEventListener('mousemove', handlePlankMove);
  plankElement.addEventListener('mouseleave', handlePlankLeave);
  resetButton.addEventListener('click', handleReset);
}

init();