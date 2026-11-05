import { useState } from 'react';
import Board from './Board';
import { FLEET_SIZES } from '../game/constants';
import {
  canPlaceShip,
  getRemainingSizes,
  getShipPositions,
  isFleetComplete,
} from '../game/rules';
import type { Coordinate, Orientation, Player } from '../game/types';

interface ShipPlacementProps {
  player: Player;
  onPlace: (size: number, start: Coordinate, orientation: Orientation) => void;
  onRemove: (size: number) => void;
  onConfirm: () => void;
}

export default function ShipPlacement({
  player,
  onPlace,
  onRemove,
  onConfirm,
}: ShipPlacementProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(
    () => getRemainingSizes(player)[0] ?? null
  );
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [hover, setHover] = useState<Coordinate | null>(null);

  const placedSizes = player.ships.map((s) => s.size);

  // Vista previa: el barco seleccionado, empezando en la casilla bajo el mouse
  const preview =
    selectedSize !== null && hover !== null
      ? {
          cells: getShipPositions(hover, selectedSize, orientation),
          valid: canPlaceShip(player.board, hover, selectedSize, orientation),
        }
      : undefined;

  const handleCellClick = (start: Coordinate) => {
    if (selectedSize === null) return;
    if (!canPlaceShip(player.board, start, selectedSize, orientation)) return;

    onPlace(selectedSize, start, orientation);

    // Selecciona automáticamente el siguiente barco pendiente
    setSelectedSize(
      getRemainingSizes(player).find((s) => s !== selectedSize) ?? null
    );
  };

  const handleRemove = (size: number) => {
    onRemove(size);
    setSelectedSize(size); // queda listo para recolocarlo
  };

  return (
    <section className="panel">
      <h2 className="title">⚓ {player.name}: coloca tu flota</h2>
      <p className="subtitle">Elige un barco, la orientación y haz clic en el tablero.</p>

      <div className="placement">
        <div>
          <div className="fleet">
            {FLEET_SIZES.map((size) => {
              const placed = placedSizes.includes(size);
              const selected = selectedSize === size;
              return (
                <div key={size} className="fleet__row">
                  <button
                    className={`fleet-btn${selected ? ' fleet-btn--selected' : ''}`}
                    disabled={placed}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span className="ship-icon" aria-hidden>
                      {Array.from({ length: size }, (_, i) => (
                        <span key={i} className="ship-icon__part" />
                      ))}
                    </span>
                    Barco de {size}
                  </button>
                  {placed && (
                    <>
                      <span className="placed-tag">✓ colocado</span>
                      <button className="btn btn--ghost btn--small" onClick={() => handleRemove(size)}>
                        Quitar
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <button
            className="btn btn--ghost"
            onClick={() => setOrientation((o) => (o === 'horizontal' ? 'vertical' : 'horizontal'))}
          >
            🔄 Orientación: {orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}
          </button>
        </div>

        <Board
          board={player.board}
          onCellClick={handleCellClick}
          onCellHover={setHover}
          preview={preview}
        />
      </div>

      <div className="actions">
        <button className="btn" disabled={!isFleetComplete(player)} onClick={onConfirm}>
          Confirmar flota
        </button>
        <p className="subtitle">Al confirmar, la flota queda bloqueada y no podrás cambiarla.</p>
      </div>
    </section>
  );
}