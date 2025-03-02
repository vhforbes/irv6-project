export default function Score({ isPending, home, away, game }) {
  return (
    <div className="score">
      <div>
        <h2>HOME {game}</h2>
        <h3>{isPending ? "–" : home}</h3>
      </div>
      <div>
        <h2>AWAY {game}</h2>
        <h3>{isPending ? "–" : away}</h3>
      </div>
    </div>
  );
}
