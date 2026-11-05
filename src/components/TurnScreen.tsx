interface TurnScreenProps {
  playerName: string;
  subtitle: string;
  message?: string | null;
  onContinue: () => void;
}

export default function TurnScreen({ playerName, subtitle, message, onContinue }: TurnScreenProps) {
  return (
    <section className="panel centered">
      {message && <p className="callout">{message}</p>}
      <div className="big-emoji" aria-hidden>🛳️</div>
      <h2 className="title">Turno de {playerName}</h2>
      <p className="subtitle">{subtitle}</p>
      <p className="subtitle">Pasa la computadora y pulsa continuar cuando estés listo.</p>
      <button className="btn" onClick={onContinue}>Continuar</button>
    </section>
  );
}