interface GameOverProps {
  winnerName: string;
  message: string | null;   // último disparo, ej. "💥 Jugador 1 disparó..."
  onNewGame: () => void;
}

export default function GameOver({ winnerName, message, onNewGame }: GameOverProps) {
  return (
    <section className="panel centered">
      <div className="big-emoji" aria-hidden>🏆</div>
      <h2 className="title gameover__title">¡{winnerName} ganó la batalla!</h2>
      {message && <p className="subtitle">{message}</p>}
      <button className="btn" onClick={onNewGame}>Nueva partida</button>
    </section>
  );
}