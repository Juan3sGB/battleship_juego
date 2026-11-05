interface TurnScreenProps {
  playerName: string;
  subtitle: string;
  message?: string | null;
  onContinue: () => void;
}

export default function TurnScreen({ playerName, subtitle, message, onContinue }: TurnScreenProps) {
  return (
    <div>
      {message && <p>{message}</p>}
      <h2>Turno de {playerName}</h2>
      <p>{subtitle}</p>
      <p>Pasa la computadora y pulsa continuar cuando estés listo.</p>
      <button onClick={onContinue}>Continuar</button>
    </div>
  );
}