import { Piece } from "./piece/index";
import { Bishop } from "./piece/bishop";
import { Horse } from "./piece/horse";
import { King } from "./piece/king";
import { Pawn } from "./piece/pawn";
import { Queen } from "./piece/queen";
import { Tower } from "./piece/tower";

/**
 * Réprésentation d'un plateau d'échecs basique
 */
export class Board{
    constructor() {
        this.currentTurn = 'white';
        this.playedMoves = [];
        this.isGameOver = false;
        this.board = Array(8)
            .fill(null)
            .map(() => Array(8).fill(null));
        //Blanc
        this.board[0][0] = new Tower("black", {x: 0, y: 0});
        this.board[0][1] = new Horse("black", {x: 1, y: 0});
        this.board[0][2] = new Bishop("black", {x: 2, y: 0});
        this.board[0][3] = new Queen("black", {x: 3, y: 0});
        this.board[0][4] = new King("black", {x: 4, y: 0});
        this.board[0][5] = new Bishop("black", {x: 5, y: 0});
        this.board[0][6] = new Horse("black", {x: 6, y: 0});
        this.board[0][7] = new Tower("black", {x: 7, y: 0});

        // Pions
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = new Pawn("black", {x: i, y: 1});
        }

        // Noir
        this.board[7][0] = new Tower("white", {x: 0, y: 7});
        this.board[7][1] = new Horse("white", {x: 1, y: 7});
        this.board[7][2] = new Bishop("white", {x: 2, y: 7});
        this.board[7][3] = new Queen("white", {x: 3, y: 7});
        this.board[7][4] = new King("white", {x: 4, y: 7});
        this.board[7][5] = new Bishop("white", {x: 5, y: 7});
        this.board[7][6] = new Horse("white", {x: 6, y: 7});
        this.board[7][7] = new Tower("white", {x: 7, y: 7});

        // Pions
        for (let i = 0; i < 8; i++) {
            this.board[6][i] = new Pawn("white", {x: i, y: 6});
        }
    }

    /**
     *
     * @param {Piece} piece - La pièce à déplacer
     * @param {{x: number, y:number}} newPosition - la nouvelle position de la pièce
     * @returns {boolean} - true si le mouvement est valide, sinon false
     */
    movePiece(piece, newPosition) {
        const validMoves = piece.getValidMoves(this);

        const isValidMove = validMoves.some((move) => move.x === newPosition.x && move.y === newPosition.y);
        if (isValidMove) {
            const capturedPiece = this.getPieceAt(newPosition);
            if (capturedPiece) {
                this.removePiece(capturedPiece);
                //Vérification si la partie est terminé
                if (capturedPiece.constructor.name === "King"){
                    this.isGameOver = true;
                }
            }

            const oldPosition = { ...piece.position }; // Stockez l'ancienne position
            piece.position = newPosition;
            piece.hasMoved = true;

            if (piece.constructor.name === "Pawn" && (newPosition.y === 0 || newPosition.y === 7)) {
                this.showPromotionOptions(piece);
            } else {
                this.finalizeMove(piece, newPosition, oldPosition);
            }

            /* if (piece.constructor.name === "King" && !piece.hasMoved) {
                 const castlingMove = piece.checkCastling(this, newPosition);
                 if (castlingMove) {
                     this.moveCastlingRook(castlingMove);
                 }
             }*/

            return true;
        } else {
            return false;
        }
    }

    /**
     * TODO -- TODO
     * Déplace la tour lors d'un roque
     * @param {Object} castlingMove

    moveCastlingRook(castlingMove) {
        const { tower, towerStartPosition, towerEndPosition } = castlingMove;
        this.setPieceAt(towerStartPosition, null);
        tower.position = towerEndPosition;
        this.setPieceAt(towerEndPosition, tower);
        tower.hasMoved = true;
    }
     * TODO -- TODO
     */

    /**
     * Affiche les promotions possible pour un pion lors de son arrivée au bout du plateau
     * @param {Pawn} piece - Le pion à promouvoir
     */
    showPromotionOptions(piece) {
        const options = ["reine", "tour", "fou", "cavalier", "Reine", "Tour", "Fou", "Cavalier"];
        const newPieceType = prompt("Choisissez une pièce pour la promotion (Reine, Tour, Fou, Cavalier) :");

        if (options.includes(newPieceType)) {
            let promotedPieceType;
            switch (newPieceType) {
                case "Reine":
                case "reine":
                    promotedPieceType = "Queen";
                    break;
                case "Tour":
                case "tour":
                    promotedPieceType = "Tower";
                    break;
                case "Fou":
                case "fou":
                    promotedPieceType = "Bishop";
                    break;
                case "Cavalier":
                case "cavalier":
                    promotedPieceType = "Horse";
                    break;
                default:
                    throw new Error("Invalid piece type");
            }
            this.removePiece(piece);
            const promotedPiece = piece.promote(promotedPieceType);
            this.setPieceAt(piece.position, promotedPiece);
            this.switchTurn();

        } else {
            alert("Pièce invalide. Veuillez choisir parmi les options valides.");
            this.showPromotionOptions(piece);
        }
    }

    /**
     *
     * @param {Piece} piece - La pièce à déplacer
     * @param {{x: number, y:number}} newPosition - La nouvelle position de la pièce
     * @param {{x: number, y:number}} oldPosition - L'ancienne position de la pièce
     */
    finalizeMove(piece, newPosition, oldPosition) {
        piece.position = newPosition;
        this.playedMoves.push({ pieceColor: piece.color, pieceName: piece.constructor.name, from: oldPosition, to: piece.position });
        this.setPieceAt(newPosition, piece);
        this.setPieceAt(oldPosition, null);
        this.switchTurn();
        this.checkGameOver();
    }

    /**
     * Supprime une pièce donnée du plateau
     * @param {Piece} piece
     */
    removePiece(piece) {
        return this.setPieceAt(piece.position, null);
    }

    /**
     * Permet de placer une pièce sur le plateau
     * @param {{x: number, y:number}} position - La position ou la pièce doit être placée
     * @param {Piece} piece - La pièce à placer
     */
    setPieceAt(position, piece) {
        const { x, y } = position;
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            this.board[y][x] = piece;
        }
    }

    /**
     * Regarde si une pièce est à la position demandée
     * @param {{x: number, y:number}} position - La position à vérifier
     * @returns {Piece|null} - Pièce trouvée, ou null
     */
    getPieceAt(position) {
        const { x, y } = position;
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            return this.board[y][x];
        } else {
            return null;
        }
    }

    /**
     * Récupération de la position d'une pièce par son ID
     * @param {string} id - ID de la pièce
     * @returns {Piece|null} - Pièce trouvée, ou null
     */
    getPieceById(id) {
        const [color, piece, x, y] = id.split('-');
        const position = {
            x: parseInt(x),
            y: parseInt(y)
        };
        return this.getPieceAtInverted(position);
    }

    /**
     * Inversion de l'axe X et Y
     * @param {{x: number, y:number}} position - La position qui devra être inversé
     * @returns {Piece|null} - Nouvelles coordonnées de la pièce
     */
    getPieceAtInverted(position) {
        const invertedPosition = {
            x: position.y,
            y: position.x,
        };
        return this.getPieceAt(invertedPosition);
    }

    /**
     * Récupération de tous les coups joués
     * @returns {[]}
     */
    getPlayedMoves() {
        return this.playedMoves;
    }

    /**
     * Permet de modifier le tour de jeu
     * @returns {string}
     */
    switchTurn() {
       return this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    }

    /**
     * Vérification de l'état de la game en fonction de l'état du Roi
     */
    checkGameOver() {
        const kings = [false, false];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.getPieceAt({ y, x });
                if (piece && piece.constructor.name === 'King') {
                    if (piece.color === 'white') {
                        kings[0] = true;
                    } else {
                        kings[1] = true;
                    }
                }
            }
        }

        if (!kings[0] || !kings[1]) {
            this.isGameOver = true;
            const winner = kings[0] ? 'Blanc' : 'Noir';
            alert(`${winner} a gagné la partie !`);
        }
    }
}



