const CANVAS_SIZE = [500, 500];
const SNAKE_START = [
  [8, 7],
  [8, 8],
];
const APPLE_START = [8, 5];
const SCALE = 20;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0], // right
};

const SPEED = 200;

const POINTS = [
  {
    color: "yellow",
    value: 1,
  },
  {
    color: "orange",
    value: 5,
  },
  {
    color: "red",
    value: 10,
  },
];

export { CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE, DIRECTIONS, SPEED, POINTS };
