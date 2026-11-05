import type { Board as BoardGrid, Coordinate } from '../game/types';

interface BoardProps {
  board: BoardGrid;
  hideShips?: boolean;                              // true para el tablero enemigo
  onCellClick?: (target: Coordinate) => void;
  onCellHover?: (target: Coordinate | null) => void;
  preview?: { cells: Coordinate[]; valid: boolean }; // vista previa al colocar
}

// A = agua, B = barco, X = acierto, O = fallo
const SYMBOLS = { water: 'A', ship: 'B', hit: 'X', miss: 'O' } as const;

export default function Board({
  board,
  hideShips = false,
  onCellClick,
  onCellHover,
  preview,
}: BoardProps) {
  return (
    <div
      onMouseLeave={() => onCellHover?.(null)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board.length}, 2.5rem)`,
        gap: 2,
      }}
    >
      {board.map((cells, row) =>
        cells.map((cell, col) => {
          // En el tablero enemigo, los barcos se ven como agua
          const visible = hideShips && cell === 'ship' ? 'water' : cell;
          const alreadyShot = visible === 'hit' || visible === 'miss';

          const inPreview =
            preview?.cells.some((c) => c.row === row && c.col === col) ?? false;
          const background = inPreview
            ? preview?.valid
              ? '#86efac'
              : '#fca5a5'
            : undefined;

          return (
            <button
              key={`${row}-${col}`}
              style={{ height: '2.5rem', background }}
              disabled={!onCellClick || alreadyShot}
              onClick={() => onCellClick?.({ row, col })}
              onMouseEnter={() => onCellHover?.({ row, col })}
            >
              {SYMBOLS[visible]}
            </button>
          );
        })
      )}
    </div>
  );
}