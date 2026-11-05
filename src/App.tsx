import { useReducer, type ReactNode } from 'react';
import Board from './components/Board';
import GameOver from './components/GameOver';
import GameStatus from './components/GameStatus';
import ShipPlacement from './components/ShipPlacement';
import TurnScreen from './components/TurnScreen';
import { createInitialGameState } from './game/board';
import { describeLastShot } from './game/messages';
import { gameReducer, otherPlayer } from './game/reducer';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, () =>
    createInitialGameState()
  );

  const activePlayer = state.players[state.activePlayer];
  const bothReady = state.players.every((p) => p.fleetConfirmed);
  const newGame = () => dispatch({ type: 'NEW_GAME' });

  let screen: ReactNode = null;

  if (state.phase === 'placement') {
    screen = (
      <ShipPlacement
        player={activePlayer}
        onPlace={(size, start, orientation) =>
          dispatch({ type: 'PLACE_SHIP', size, start, orientation })
        }
        onRemove={(size) => dispatch({ type: 'REMOVE_SHIP', size })}
        onConfirm={() => dispatch({ type: 'CONFIRM_FLEET' })}
      />
    );
  } else if (state.phase === 'transition') {
    screen = (
      <TurnScreen
        playerName={activePlayer.name}
        subtitle={bothReady ? 'Es tu turno de disparar' : 'Coloca tu flota'}
        message={describeLastShot(state.lastShot, state.players)}
        onContinue={() => dispatch({ type: 'CONTINUE' })}
      />
    );
  } else if (state.phase === 'playing') {
    const enemy = state.players[otherPlayer(state.activePlayer)];
    screen = (
      <section className="panel">
        <GameStatus state={state} />
        <div className="boards">
          <div>
            <h3>🎯 Aguas enemigas</h3>
            <Board
              board={enemy.board}
              hideShips
              onCellClick={(target) => dispatch({ type: 'FIRE', target })}
            />
          </div>
          <div>
            <h3>🚢 Tu flota</h3>
            <Board board={activePlayer.board} />
          </div>
        </div>
        <div className="actions">
          <button className="btn btn--ghost" onClick={newGame}>Nueva partida</button>
        </div>
      </section>
    );
  } else if (state.phase === 'gameOver' && state.winner !== null) {
    screen = (
      <GameOver
        winnerName={state.players[state.winner].name}
        message={describeLastShot(state.lastShot, state.players)}
        onNewGame={newGame}
      />
    );
  }

  return (
    <main className="app">
      <div className="screen" key={`${state.phase}-${state.activePlayer}`}>
        {screen}
      </div>
    </main>
  );
}