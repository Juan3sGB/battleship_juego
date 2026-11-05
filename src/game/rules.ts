import { BOARD_SIZE, FLEET_SIZES } from './constants';
import type { Board, Coordinate, Orientation, Player, Ship } from './types';

/** Calcula las casillas que ocuparía un barco (sin validar nada). */
export function getShipPositions(
  start: Coordinate,
  size: number,
  orientation: Orientation
): Coordinate[] {
  return Array.from({ length: size }, (_, i) => ({
    row: start.row + (orientation === 'vertical' ? i : 0),
    col: start.col + (orientation === 'horizontal' ? i : 0),
  }));
}

/** ¿El barco cabe dentro del tablero y no pisa a otro? */
export function canPlaceShip(
  board: Board,
  start: Coordinate,
  size: number,
  orientation: Orientation
): boolean {
  const positions = getShipPositions(start, size, orientation);

  return positions.every(
    ({ row, col }) =>
      row >= 0 &&
      row < BOARD_SIZE &&
      col >= 0 &&
      col < BOARD_SIZE &&
      board[row][col] === 'water'
  );
}

/** Tamaños de barco que el jugador todavía no ha colocado. */
export function getRemainingSizes(player: Player): number[] {
  const placed = player.ships.map((s) => s.size);
  return FLEET_SIZES.filter((size) => !placed.includes(size));
}

export function isFleetComplete(player: Player): boolean {
  return getRemainingSizes(player).length === 0;
}

/**
 * Coloca un barco. Devuelve el mismo jugador si la jugada no es válida:
 * flota ya confirmada, barco ya colocado, tamaño inexistente o posición inválida.
 */
export function placeShip(
  player: Player,
  size: number,
  start: Coordinate,
  orientation: Orientation
): Player {
  if (player.fleetConfirmed) return player;
  if (!getRemainingSizes(player).includes(size)) return player;
  if (!canPlaceShip(player.board, start, size, orientation)) return player;

  const positions = getShipPositions(start, size, orientation);

  const board = player.board.map((row) => [...row]);
  positions.forEach(({ row, col }) => {
    board[row][col] = 'ship';
  });

  const ship: Ship = {
    id: `ship-${size}`,
    size,
    positions,
    sunk: false,
  };

  return { ...player, board, ships: [...player.ships, ship] };
}

/** Quita un barco ya colocado (solo antes de confirmar la flota). */
export function removeShip(player: Player, size: number): Player {
  if (player.fleetConfirmed) return player;

  const ship = player.ships.find((s) => s.size === size);
  if (!ship) return player;

  const board = player.board.map((row) => [...row]);
  ship.positions.forEach(({ row, col }) => {
    board[row][col] = 'water';
  });

  return {
    ...player,
    board,
    ships: player.ships.filter((s) => s.size !== size),
  };
}

/** Bloquea la flota. Solo funciona si están los 3 barcos colocados. */
export function confirmFleet(player: Player): Player {
  if (!isFleetComplete(player)) return player;
  return { ...player, fleetConfirmed: true };
}



export interface ShotOutcome {
  defender: Player;          // el defensor ya con el disparo aplicado
  result: 'hit' | 'miss';
  sankShipId?: string;       // si este disparo hundió un barco
}

/** ¿Puede el atacante disparar ahí? (dentro del tablero y sin repetir celda) */
export function canFireAt(attacker: Player, target: Coordinate): boolean {
  const inBounds =
    target.row >= 0 &&
    target.row < BOARD_SIZE &&
    target.col >= 0 &&
    target.col < BOARD_SIZE;

  const alreadyShot = attacker.shotsFired.some(
    (s) => s.row === target.row && s.col === target.col
  );

  return inBounds && !alreadyShot;
}

/** Aplica un disparo sobre el tablero del defensor. Asume que ya se validó con canFireAt. */
export function receiveShot(defender: Player, target: Coordinate): ShotOutcome {
  const { row, col } = target;
  const board = defender.board.map((r) => [...r]);

  if (board[row][col] !== 'ship') {
    board[row][col] = 'miss';
    return { defender: { ...defender, board }, result: 'miss' };
  }

  board[row][col] = 'hit';

  // ¿Qué barco fue alcanzado y quedó completamente destruido?
  const hitShip = defender.ships.find((s) =>
    s.positions.some((p) => p.row === row && p.col === col)
  );
  const nowSunk =
    hitShip !== undefined &&
    hitShip.positions.every((p) => board[p.row][p.col] === 'hit');

  const ships = defender.ships.map((s) =>
    s === hitShip && nowSunk ? { ...s, sunk: true } : s
  );

  return {
    defender: { ...defender, board, ships },
    result: 'hit',
    sankShipId: nowSunk ? hitShip.id : undefined,
  };
}

/** Perdió quien tiene todos sus barcos hundidos (equivale a las 12 casillas acertadas). */
export function hasLost(player: Player): boolean {
  return player.ships.length > 0 && player.ships.every((s) => s.sunk);
}