import type { Coordinate, LastShot, Player } from './types';

export function formatCoordinate({ row, col }: Coordinate): string {
  return `fila ${row + 1}, columna ${col + 1}`;
}

export function describeLastShot(
  lastShot: LastShot | null,
  players: [Player, Player]
): string | null {
  if (!lastShot) return null;

  const who = players[lastShot.by].name;
  const where = formatCoordinate(lastShot.at);

  if (lastShot.result === 'miss') return `${who} disparó (${where}): ¡agua!`;

  if (lastShot.sankShipId) {
    const size = lastShot.sankShipId.replace('ship-', '');
    return `${who} disparó (${where}): ¡acierto y hundió el barco de ${size}!`;
  }

  return `${who} disparó (${where}): ¡acierto!`;
}