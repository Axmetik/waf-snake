import React, { useState, useRef, useEffect } from "react";
import "./assets/App.css";
import { useInterval } from "./hooks/useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  DIRECTIONS,
  SPEED,
  POINTS,
} from "./constants";
import axios from "axios";
import Leaderboard from "./features/Leaderboard/Leaderboard";

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [speedCounter, setSpeedCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [count, setCount] = useState(0);
  const [player, setPlayer] = useState("");
  const [leaderboard, setLeaderboard] = useState(null);
  const [point, setPoint] = useState(POINTS[0]);

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setSpeedCounter(0);
    setGameOver(true);
    addPlayer();
  };

  async function addPlayer() {
    try {
      const newPlayer = { player_name: player, count: count };
      await axios.post(`http://localhost:5000/addPlayer`, newPlayer);
    } catch (error) {
      throw new Error(error);
    }
  }

  const moveSnake = ({ keyCode }) => keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

  const createApple = () =>
    apple.map((a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    ) {
      return true;
    }

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      setCount((curr) => curr + Object.values(point)[1]);
      setPoint(POINTS[Math.floor(Math.random() * 3)]);
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
    increaseSpeed();
  };

  const increaseSpeed = () => {
    if (count / 50 > speedCounter) {
      setSpeed((curr) => curr - 10);
      setSpeedCounter((curr) => (curr += 1));
    }
  };

  const startGame = () => {
    setCount(0);
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setSpeed(SPEED);
    setDir([0, -1]);
    setGameOver(false);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "green";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = Object.values(point)[0];
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver, count, point]);

  useEffect(() => {
    async function getPlayers() {
      try {
        const res = await axios.get(`http://localhost:5000/getPlayers`);
        let data = res.data.sort((a, b) => b.count - a.count)?.slice(0, 10);
        setLeaderboard(data);
      } catch (error) {
        throw new Error(error);
      }
    }

    getPlayers();
  }, [gameOver]);

  const handleButton = (e) => {
    e.preventDefault();
    startGame();
  };

  return (
    <div className="wrapper">
      <div className="content" role="button" tabIndex="0" onKeyDown={(e) => moveSnake(e)}>
        <div className="initialization">
          <span>Score: {count}</span>
          <form>
            <input type="text" value={player} onChange={(e) => setPlayer(e.target.value)} />
            <button onClick={handleButton} disabled={!player}>
              Start Game
            </button>
          </form>
        </div>
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} width={`${CANVAS_SIZE[0]}px`} height={`${CANVAS_SIZE[1]}px`} />
          {gameOver && <div className="game-over">GAME OVER!</div>}
        </div>
      </div>
      <Leaderboard leaders={leaderboard} />
    </div>
  );
};

export default App;
