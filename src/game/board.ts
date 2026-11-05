import { BOARD_SIZE } from './constants';
import type { Board, GameState, Player } from './types';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 'water' as const)
  );
}

export function createPlayer(name: string): Player {
  return {
    name,
    board: createEmptyBoard(),
    ships: [],
    shotsFired: [],
    fleetConfirmed: false,
  };
}

export function createInitialGameState(): GameState {
  return {
    phase: 'placement',
    players: [createPlayer('Jugador 1'), createPlayer('Jugador 2')],
    activePlayer: 0,
    winner: null,
    lastShot: null,
  };
}