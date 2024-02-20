function Leader({ player, index }) {
  return (
    <li>
      <div style={{ display: "flex", gap: "1em" }}>
        <span>{index}. </span>
        <span>
          {player.player_name}#{player.id}
        </span>
      </div>
      <span>{player.count} pts.</span>
    </li>
  );
}

export default Leader;
