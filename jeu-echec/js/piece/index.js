export class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.hasMoved = false;
    }

    getValidMoves(board) {
        throw new Error("getValidMoves() doit être implémentée");
    }
}