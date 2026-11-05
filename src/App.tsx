import { useReducer } from 'react';
import { createInitialGameState } from './game/board';
import TurnScreen from './components/TurnScreen';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import { describeLastShot } from './game/messages';
import { gameReducer, otherPlayer } from './game/reducer';
import ShipPlacement from './components/ShipPlacement';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, () =>
    createInitialGameState()
  );

  const activePlayer = state.players[state.activePlayer];
  const bothReady = state.players.every((p) => p.fleetConfirmed);

  if (state.phase === 'transition') {
    return (
      <TurnScreen
        playerName={activePlayer.name}
        subtitle={bothReady ? 'Es tu turno de disparar' : 'Coloca tu flota'}
        message={describeLastShot(state.lastShot, state.players)}
        onContinue={() => dispatch({ type: 'CONTINUE' })}
      />
    );
  }

  if (state.phase === 'placement') {
    return (
      <ShipPlacement
        key={state.activePlayer}
        player={activePlayer}
        onPlace={(size, start, orientation) =>
          dispatch({ type: 'PLACE_SHIP', size, start, orientation })
        }
        onRemove={(size) => dispatch({ type: 'REMOVE_SHIP', size })}
        onConfirm={() => dispatch({ type: 'CONFIRM_FLEET' })}
      />
    );
  }

  if (state.phase === 'playing') {
    const enemy = state.players[otherPlayer(state.activePlayer)];

    return (
      <div>
        <GameStatus state={state} />

        <h3>Tablero enemigo (dispara aquí)</h3>
        <Board
          board={enemy.board}
          hideShips
          onCellClick={(target) => dispatch({ type: 'FIRE', target })}
        />

        <h3>Tu tablero</h3>
        <Board board={activePlayer.board} />

        <button onClick={() => dispatch({ type: 'NEW_GAME' })}>Nueva partida</button>
      </div>
    );
  }

  if (state.phase === 'gameOver' && state.winner !== null) {
    return (
      <div>
        <h2>¡Ganó {state.players[state.winner].name}!</h2>
        <p>{describeLastShot(state.lastShot, state.players)}</p>
        <button onClick={() => dispatch({ type: 'NEW_GAME' })}>Nueva partida</button>
      </div>
    );
  }

  return null;
}