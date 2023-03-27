import {Piece} from "./index";

export class King extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getValidMoves(board) {
        const validMoves = [];
        const castlingMoves = [];
        //Binding des déplacements possibles
        const directions = [
            {x: 0, y: 1},
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: -1, y: 0},
            {x: 1, y: 1},
            {x: 1, y: -1},
            {x: -1, y: 1},
            {x: -1, y: -1},
        ];

        for (const direction of directions) {
            let newX = this.position.x + direction.x;
            let newY = this.position.y + direction.y;

            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const targetPosition = {x: newX, y: newY};
                const targetPiece = board.getPieceAt(targetPosition);
                //S'il n'y a pas de pièce à l'endroit choisi
                if (!targetPiece) {
                    validMoves.push(targetPosition);
                } else {
                    //Si c'est une pièce de la couleur opposée
                    if (targetPiece.color !== this.color) {
                        validMoves.push(targetPosition);
                    }
                }
            }
        }

        if (!this.hasMoved) {
            castlingMoves.push(...this.getCastlingMoves(board));
        }

        return [...validMoves, ...castlingMoves];
    }

    getCastlingMoves(board) {
        const castlingMoves = [];

        const rookShortPosition = {x: 7, y: this.position.y};
        if (this.checkCastling(board, rookShortPosition)) {
            castlingMoves.push({x: this.position.x + 2, y: this.position.y});
        }

        const rookLongPosition = {x: 0, y: this.position.y};
        if (this.checkCastling(board, rookLongPosition)) {
            castlingMoves.push({x: this.position.x - 2, y: this.position.y});
        }

        return castlingMoves;
    }

    checkCastling(board, rookPosition) {
        const rook = board.getPieceAt(rookPosition);
        if (rook && rook.constructor.name === "Rook" && !this.hasMoved && !rook.hasMoved) {
            const step = rookPosition.x > this.position.x ? 1 : -1;
            for (let x = this.position.x + step; x !== rookPosition.x; x += step) {
                if (board.getPieceAt({y: this.position.y, x})) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}