import { createInitialGameState } from './board';
import { canFireAt, confirmFleet, hasLost, isFleetComplete, placeShip, receiveShot, removeShip } from './rules';
import type { Coordinate, GameState, LastShot, Orientation, Player, PlayerIndex } from './types';

export type GameAction =
  | { type: 'PLACE_SHIP'; size: number; start: Coordinate; orientation: Orientation }
  | { type: 'REMOVE_SHIP'; size: number }
  | { type: 'CONFIRM_FLEET' }
  | { type: 'FIRE'; target: Coordinate }
  | { type: 'CONTINUE' }
  | { type: 'NEW_GAME' };

export function otherPlayer(index: PlayerIndex): PlayerIndex {
  return index === 0 ? 1 : 0;
}

function updateActivePlayer(
  state: GameState,
  update: (player: Player) => Player
): GameState {
  const players = [...state.players] as [Player, Player];
  players[state.activePlayer] = update(players[state.activePlayer]);
  return { ...state, players };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_SHIP': {
      if (state.phase !== 'placement') return state;
      return updateActivePlayer(state, (p) =>
        placeShip(p, action.size, action.start, action.orientation)
      );
    }

    case 'REMOVE_SHIP': {
      if (state.phase !== 'placement') return state;
      return updateActivePlayer(state, (p) => removeShip(p, action.size));
    }

    case 'CONFIRM_FLEET': {
      if (state.phase !== 'placement') return state;
      if (!isFleetComplete(state.players[state.activePlayer])) return state;

      // Bloquea la flota y pasa el turno a la pantalla de privacidad
      const confirmed = updateActivePlayer(state, confirmFleet);
      return {
        ...confirmed,
        phase: 'transition',
        activePlayer: otherPlayer(state.activePlayer),
      };
    }

        case 'FIRE': {
      if (state.phase !== 'playing') return state;

      const attackerIndex = state.activePlayer;
      const defenderIndex = otherPlayer(attackerIndex);
      const attacker = state.players[attackerIndex];

      // Celda repetida o fuera del tablero: se ignora, el turno no cambia
      if (!canFireAt(attacker, action.target)) return state;

      const outcome = receiveShot(state.players[defenderIndex], action.target);

      const players = [...state.players] as [Player, Player];
      players[attackerIndex] = {
        ...attacker,
        shotsFired: [...attacker.shotsFired, action.target],
      };
      players[defenderIndex] = outcome.defender;

      const lastShot: LastShot = {
        by: attackerIndex,
        at: action.target,
        result: outcome.result,
        sankShipId: outcome.sankShipId,
      };

      const next = { ...state, players, lastShot };

      // Destruyó la flota enemiga: gana
      if (hasLost(outcome.defender)) {
        return { ...next, phase: 'gameOver', winner: attackerIndex };
      }

      // Acierto: el mismo jugador sigue
      if (outcome.result === 'hit') return next;

      // Fallo: pantalla de privacidad y cambio de jugador
      return { ...next, phase: 'transition', activePlayer: defenderIndex };
    }

    case 'CONTINUE': {
      if (state.phase !== 'transition') return state;
      // Si ambos ya confirmaron la flota, empieza la batalla;
      // si no, le toca colocar al otro jugador.
      const bothReady = state.players.every((p) => p.fleetConfirmed);
      return { ...state, phase: bothReady ? 'playing' : 'placement' };
    }

    case 'NEW_GAME':
      return createInitialGameState();

    default:
      return state;
  }
}