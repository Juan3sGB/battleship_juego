export type CellState = 'water' | 'ship' | 'hit' | 'miss';

export type Orientation = 'horizontal' | 'vertical';

export type PlayerIndex = 0 | 1;

export interface Coordinate {
  row: number;
  col: number;
}

export type Board = CellState[][];

export interface Ship {
  id: string;               // 'ship-5', 'ship-4', 'ship-3'
  size: number;
  positions: Coordinate[];  // casillas que ocupa
  sunk: boolean;
}

export interface Player {
  name: string;
  board: Board;               // tablero PROPIO (con sus barcos y los disparos recibidos)
  ships: Ship[];
  shotsFired: Coordinate[];   // disparos que este jugador hizo al enemigo
  fleetConfirmed: boolean;    // true cuando bloqueó su flota
}

export type GamePhase =
  | 'placement'     // cada jugador coloca sus barcos
  | 'transition'    // pantalla de privacidad entre turnos
  | 'playing'       // se está disparando
  | 'gameOver';

export interface LastShot {
  by: PlayerIndex;
  at: Coordinate;
  result: 'hit' | 'miss';
  sankShipId?: string;        // si el disparo hundió un barco
}

export interface GameState {
  phase: GamePhase;
  players: [Player, Player];
  activePlayer: PlayerIndex;
  winner: PlayerIndex | null;
  lastShot: LastShot | null;  // para mostrar el mensaje en GameStatus
}