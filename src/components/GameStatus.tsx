import { describeLastShot } from '../game/messages';
import type { GameState } from '../game/types';

export default function GameStatus({ state }: { state: GameState }) {
  const message = describeLastShot(state.lastShot, state.players);
  const result = state.lastShot?.result;

  return (
    <header>
      <h2 className="title">⚓ Turno de {state.players[state.activePlayer].name}</h2>
      {message && <p className={`callout callout--${result}`}>{message}</p>}
    </header>
  );
}