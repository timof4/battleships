import Cell from './Cell'
import Position from './Position'

class Grid {
    public cells: Cell[][]

    constructor(cells: Cell[][]) {
        this.cells = cells
    }

    static initGrid(col: number, row: number): Grid {
        const grid: Cell[][] = [];
        for (var r: number = 0; r < row; r++) {
            const rowItems: Cell[] = [];
            for (var c: number = 0; c < col; c++) {
                const p = new Position(c, r)
                rowItems[c] = new Cell(p);
            }
            grid[r] = rowItems
        }

        return new Grid(grid)
    }
}

export default Grid