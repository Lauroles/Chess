import { Piece } from "./index.js";
import { Queen } from "./queen.js";
import { Tower } from "./tower.js";
import { Horse } from "./horse.js";
import { Bishop } from "./bishop.js";

export class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    promote(newPieceType) {
        switch (newPieceType) {
            case "Queen":
                return new Queen(this.color, this.position);
            case "Tower":
                return new Tower(this.color, this.position);
            case "Bishop":
                return new Bishop(this.color, this.position);
            case "Horse":
                return new Horse(this.color, this.position);
            default:
                throw new Error("Invalid piece type for promotion");
        }
    }


    getValidMoves(board) {
        const validMoves = [];
        const direction = this.color === "white" ? -1 : 1;
        const nextRow = this.position.y + direction;

        // Vérifier si la case devant le pion est vide
        const forwardMove = board.getPieceAt({ x: this.position.x, y: nextRow });

        // Avancer d'une case
        if (!forwardMove) {
            validMoves.push({ x: this.position.x, y: nextRow });
            //Check si 2 cases disponible
            if (
                (this.color === "white" && this.position.y === 6) ||
                (this.color === "black" && this.position.y === 1)
            ) {
                const doubleNextRow = nextRow + direction;
                const doubleForwardMove = board.getPieceAt({
                    x: this.position.x,
                    y: doubleNextRow
                });

                if (!doubleForwardMove) {
                    validMoves.push({ x: this.position.x, y: doubleNextRow });
                }
            }
        }
        // Prise diagonale
        for (let i = -1; i <= 1; i += 2) {
            const newX = this.position.x + i;
            const capturePiece = board.getPieceAt({ x: newX, y: nextRow });
            if (capturePiece && capturePiece.color !== this.color) {
                validMoves.push({ x: newX, y: nextRow });
            }
        }

        return validMoves;
    }



}
