import Leader from "./Leader";

function Leaderboard({ leaders }) {
  return (
    <div className="leaderboard">
      <h1>👑Leaderboard👑</h1>
      {leaders && (
        <ol>
          {leaders.map((player) => (
            <Leader player={player} index={leaders.indexOf(player) + 1} key={player.id} />
          ))}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;
