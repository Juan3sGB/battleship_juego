import { describeLastShot } from '../game/messages';
import type { GameState } from '../game/types';

export default function GameStatus({ state }: { state: GameState }) {
  const message = describeLastShot(state.lastShot, state.players);

  return (
    <div>
      <h2>Turno de {state.players[state.activePlayer].name}</h2>
      {message && <p>{message}</p>}
    </div>
  );
}