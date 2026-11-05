import type { Board as BoardGrid, Coordinate } from '../game/types';

interface BoardProps {
  board: BoardGrid;
  hideShips?: boolean;
  onCellClick?: (target: Coordinate) => void;
  onCellHover?: (target: Coordinate | null) => void;
  preview?: { cells: Coordinate[]; valid: boolean };
}

const ICONS = { water: '', ship: '', hit: '💥', miss: '💧' } as const;

export default function Board({
  board,
  hideShips = false,
  onCellClick,
  onCellHover,
  preview,
}: BoardProps) {
  const interactive = onCellClick !== undefined;

  return (
    <div
      className={`board${interactive ? ' board--interactive' : ''}`}
      style={{ gridTemplateColumns: `repeat(${board.length}, var(--cell))` }}
      onMouseLeave={() => onCellHover?.(null)}
    >
      {board.map((cells, row) =>
        cells.map((cell, col) => {
          const visible = hideShips && cell === 'ship' ? 'water' : cell;
          const alreadyShot = visible === 'hit' || visible === 'miss';

          const inPreview =
            preview?.cells.some((c) => c.row === row && c.col === col) ?? false;
          const previewClass = inPreview
            ? preview?.valid
              ? ' cell--preview-ok'
              : ' cell--preview-bad'
            : '';

          return (
            <button
              key={`${row}-${col}`}
              className={`cell cell--${visible}${previewClass}`}
              aria-label={`Fila ${row + 1}, columna ${col + 1}`}
              disabled={!interactive || alreadyShot}
              onClick={() => onCellClick?.({ row, col })}
              onMouseEnter={() => onCellHover?.({ row, col })}
            >
              {ICONS[visible]}
            </button>
          );
        })
      )}
    </div>
  );
}