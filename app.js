'use strict';

const pieces = {
    white: {
        rook: '♖',
        night: '♘',
        bishop: '♗',
        queen: '♕',
        king: '♔',
    },
    black: {
        rook: '♜',
        night: '♞',
        bishop: '♝',
        queen: '♛',
        king: '♚',
    }
};



function createBoardElement() {
    const colors = {
        white: 'white',
        black: 'black'
    };
    let board = document.createElement('board');
    let rowColor = colors.white;
    let color;
    for (let i = 0; i < 8; i++) {
        let row = document.createElement('row');
        row.id = 'row_' + i;
        color = rowColor;
        rowColor = rowColor === colors.black ? colors.white : colors.black;
        for (let j = 0; j < 8; j++) {
            let field = document.createElement('field');
            field.id = 'field_' + j;
            field.classList.add(color);
            color = color === colors.black ? colors.white : colors.black;
            row.append(field);
        }
        board.append(row);
    }
    return board;
}

function addPieceToBoard(piece, x, y) {
    let row;
    if (!(row = document.querySelector('#row_' + x))) {
        return;
    }
    let fieldId = 'field_' + y;
    for (let field of row.childNodes) {
        if (field.id === fieldId) {
            if (field.childNodes.length > 0) {
                field.innerHTML = piece.outerHTML;
                return;
            }
            field.append(piece);
        }
    }
}

function createPieceElement(color, name) {
    const pieces = {
        white: {
            rook: '♖',
            night: '♘',
            bishop: '♗',
            queen: '♕',
            king: '♔',
            pawn: '♙',
        },
        black: {
            rook: '♜',
            night: '♞',
            bishop: '♝',
            queen: '♛',
            king: '♚',
            pawn: '♟',
        }
    }
    let piece = document.createElement('piece');
    piece.innerText = pieces[color][name];

    return piece;
};

function Piece(name, color) {
    this.name = name;
    this.color = color;
}

function Coordinate(x, y) {
    this.x = x;
    this.y = y;

    this.equals = function (coordinate) {
        return this.x === coordinate.x && this.y === coordinate.y;
    }
}

function PieceCollection() {
    this.coordinates = [];
    this.pieces = [];

    this.add = function (piece, coordinate) {
        this.coordinates.push(coordinate);
        this.pieces.push(piece);
    };

    this.getPieceByCoordinate = function (coordinate) {
        let i;
        for (i = 0; i < this.coordinates.length; i++) {
            if (coordinate.equals(this.coordinates[i])) {
                return this.pieces[i];
            }
        }
        return null;
    }
}

function draw(pieceCollection) {
    pieceCollection.coordinates.forEach(coordinate => {
        let piece;
        if (piece = pieceCollection.getPieceByCoordinate(coordinate)) {
            let pieceElement = createPieceElement(piece.color, piece.name);
            addPieceToBoard(pieceElement, coordinate.x, coordinate.y);
        }
    });
}

function translateCoordinate(coordinate) {
    return coordinate;
}

function getPieceCollectionByFen(fen) {
    fen = fen.split(' ').shift();
    let fenParts = fen.split('/');
    let pieceCollection = new PieceCollection();
    let rowCount = 0;
    let colCount = 0;
    let color;
    let name;
    for (let part of fenParts) {
        rowCount++;
        for (let char of part) {
            if (Number.isInteger(Number(char))) {
                colCount += Number(char);
            } else {
                colCount++;
                color = char.toUpperCase() === char ? 'white' : 'black';
                if (['r', 'R'].includes(char)) {
                    name = 'rook';
                } else if (['n', 'N'].includes(char)) {
                    name = 'night';
                } else if (['b', 'B'].includes(char)) {
                    name = 'bishop';
                } else if (['q', 'Q'].includes(char)) {
                    name = 'queen';
                } else if (['k', 'K'].includes(char)) {
                    name = 'king';
                } else if (['p', 'P'].includes(char)) {
                    name = 'pawn';
                }
                pieceCollection.add(new Piece(name, color), new Coordinate(rowCount - 1, colCount - 1));
            }
        }
        colCount = 0;
    }

    return pieceCollection;
}




let board = createBoardElement();
wrapper.append(board);
let loadButton = document.querySelector('#load');
if (loadButton) {
    loadButton.onclick = function () {
        let input = document.querySelector('#fen-input');
        if (input) {
            let value = input.value;
            console.log(value)
            if (value) {
                draw(getPieceCollectionByFen(value));
            }
        }
    };
}
