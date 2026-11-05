export const BOARD_SIZE = 6;

// Flota por jugador: un barco de 5, uno de 4 y uno de 3
export const FLEET_SIZES = [5, 4, 3] as const;

// 5 + 4 + 3 = 12 casillas con barco
export const TOTAL_SHIP_CELLS = FLEET_SIZES.reduce((a, b) => a + b, 0);