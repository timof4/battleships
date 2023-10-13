import Position from './Position'

class Cell {
    public static readonly CELL_TYPE_FOG_OF_WAR: number = 1;
    public static readonly CELL_TYPE_WATER: number = 2;
    public static readonly CELL_TYPE_SHIP: number = 3;
    public static readonly CELL_TYPE_WRACKAGE: number = 4;
    public static readonly CELL_TYPE_CLICKED: number = 5;

    public type: number
    public readonly position: Position

    constructor(position: Position) {
        this.position = position
        this.type = Cell.CELL_TYPE_FOG_OF_WAR
    }
}

export default Cell