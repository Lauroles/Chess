import {Piece} from "./index.js";

export class Tower extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getValidMoves(board) {
        const validMoves = [];
        //Binding des déplacements possibles
        const directions = [
            {x: 0, y: 1},
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: -1, y: 0},
        ];

       for (const direction of directions) {
           let newX = this.position.x + direction.x;
           let newY = this.position.y + direction.y;

           while (newX >=0 && newX < 8 && newY >=0 && newY < 8){
               const targetPosition = {x: newX, y:newY};
               const targetPiece = board.getPieceAt(targetPosition);
                //S'il n'y a pas de pièce à l'endroit choisi
               if (!targetPiece){
                   validMoves.push(targetPosition);
               } else {
                   //Si c'est une pièce de la couleur opposée
                   if (targetPiece.color !== this.color) {
                       validMoves.push(targetPosition);
                   }
                   break;
               }
               // Continuer dans la même direction pour la prochaine case
               newX += direction.x;
               newY += direction.y;
           }
       }

        return validMoves;
    }
}