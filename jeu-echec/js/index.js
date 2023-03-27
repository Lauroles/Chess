import { Board } from "./chess.js";
document.addEventListener("DOMContentLoaded", () => {

    const board = new Board();
    let selectedPiece = null;

    /**
     * Créé et affiche le plateau de jeu
     */
    function renderBoard() {

        const chessboardElement = document.getElementById("chessboard");
        chessboardElement.innerHTML = "";

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {

                const cellElement = document.createElement("div");
                cellElement.id = `${y}-${x}`;
                cellElement.classList.add((y + x) % 2 === 0 ? "white" : "black");
                chessboardElement.appendChild(cellElement);

                const piece = board.getPieceAt({y, x});

                if (piece) {
                    const pieceElement = document.createElement("div");
                    pieceElement.classList.add("piece");
                    pieceElement.style.backgroundImage = `url(./assets/${piece.color}/${piece.constructor.name}.svg)`;
                    pieceElement.id = `${piece.color}-${piece.constructor.name}-${y}-${x}`;
                    cellElement.appendChild(pieceElement);

                }
            }
        }
        const tourElement = document.getElementsByClassName("tour")[0];

        if (board.currentTurn === "white"){
            document.getElementById("currentTurn").innerHTML = "Blanc";
            tourElement.style.backgroundColor = "white";
            tourElement.style.color = "black";
        }else{
            document.getElementById("currentTurn").innerHTML = "Noir";
            tourElement.style.backgroundColor = "black";
            tourElement.style.color = "white";
        }
    }

    /**
     * Désélectionne toutes les pièces et enlève aussi tous les marqueurs
     */
    function deselectAllPieces() {
        const selectedPieces = document.querySelectorAll(".piece.selected");
        for (const selectedPiece of selectedPieces) {
            selectedPiece.classList.remove("selected");
        }
        const markers = document.querySelectorAll(".move-marker");
        markers.forEach(marker => marker.remove());
    }

    /**
     * Met à jour la liste des mouvements joués
     */
    function updatePlayedMoves() {
        const playedMovesElement = document.getElementById("alreadyPlayed");
        const moves = board.getPlayedMoves();
        let movesText = '';
        for (const move of moves) {
            let frenchName;
           switch (move.pieceName.toLowerCase()) {
               case "pawn": frenchName = "Pion"; break;
               case "tower": frenchName = "Tour";break;
               case "horse": frenchName = "Cavalier";break;
               case "bishop": frenchName = "Fou";break;
               case "queen": frenchName = "Reine";break;
               case "king": frenchName = "Roi";break;
               default: frenchName = move.pieceName;
           }
            const frenchColor = move.pieceColor === "white" ? "Blanc" : "Noir";
            movesText += `${frenchColor} - ${frenchName} de ${move.from.y}${move.from.x} à ${move.to.y}${move.to.x}\n`;
        }

        if (board.isGameOver) {
            board.switchTurn();
            let frenchWinner = board.currentTurn.toLowerCase() === "white" ? "Blanc" : "Noir";
            frenchWinner = frenchWinner.charAt(0).toUpperCase() + frenchWinner.slice(1);
            movesText += `${frenchWinner} a gagné la partie !`;
        }
        playedMovesElement.textContent = movesText;
    }

    /**
     * Affiche les marqueurs des mouvements validés pour une pièce donnée
     * @param {Piece} piece - La pièce pour laquelle on va vérifier les mouvements valides
     */
    function showValidMoveMarkers(piece) {
        const validMoves = piece.getValidMoves(board);
        validMoves.forEach(move => {
            const markerElement = document.createElement("div");
            markerElement.classList.add("move-marker");
            const cellElement = document.getElementById(`${move.y}-${move.x}`);
            cellElement.appendChild(markerElement);
        });
    }

    renderBoard();

    document.getElementById("chessboard").addEventListener("click", event => {

        // Vérifie si la partie est terminée et empêche toute action
        if (board.isGameOver) {
            return;
        }

        let target = event.target;

        if (target.classList.contains("move-marker")) {
            target = target.parentElement;
        }

        if (target.classList.contains("piece")) {
            const id = target.getAttribute("id");
            const pieceObj = board.getPieceById(id);
            const piece = board.getPieceAt(pieceObj.position);

            if (selectedPiece) {
                const moveResult = board.movePiece(selectedPiece, piece.position);

                if (!target.classList.contains("selected")){
                    deselectAllPieces();
                    target.classList.add("selected");
                    showValidMoveMarkers(piece);
                }else{
                    target.classList.remove("selected");
                }

                if (moveResult) {
                    // Mettez à jour l'affichage du plateau
                    renderBoard();
                    selectedPiece = null;
                    updatePlayedMoves();
                } else if (selectedPiece.color === piece.color) {
                    // Sélectionnez une autre pièce de la même couleur
                    selectedPiece = piece;
                } else {
                    // Désélectionnez la pièce actuelle si vous cliquez sur une pièce de couleur opposée
                    selectedPiece = null;
                    deselectAllPieces();

                }
            } else if (piece.color === board.currentTurn) {
                // Sélectionnez la pièce si elle est de la couleur du joueur dont c'est le tour
                deselectAllPieces();
                target.classList.add("selected");
                selectedPiece = piece;
                showValidMoveMarkers(piece);
            }
        } else if (selectedPiece) {
            // Essayez de déplacer la pièce sélectionnée vers la case vide
            const cellId = target.getAttribute("id");
            const [y, x] = cellId.split("-").map(num => parseInt(num));
            const to = {
                y: y,
                x: x
            };

            const moveResult = board.movePiece(selectedPiece, to);

            if (moveResult) {
                renderBoard();
                selectedPiece = null;
                updatePlayedMoves();
            }
        }
    });
});
