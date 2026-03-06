const plankElement = document.querySelector('.plank');

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

  renderWeights();
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

function init() {
  plankElement.addEventListener('click', handlePlankClick);
}

init();