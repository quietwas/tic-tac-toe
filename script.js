function Gameboard() {
    const rows = 3
    const cols = 3
    const board = []

    for(let i = 0; i < rows; i++){
        board[i] = []
        for(let j = 0; j < cols; j++){
            board[i].push(Cell())
        }
    }

    const getBoard = () => board

    const placeToken = (row, col, player) => {
        // Check value of current cell and if empty update
        const currentCellValue = board[row][col].getValue()
        if(currentCellValue === 0){
            board[row][col].addToken(player)
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    return {
        getBoard,
        placeToken,
        printBoard
    }
}

function Cell() {
    let value = 0

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value

    return {
        addToken,
        getValue
    }
}

function GameController() {
    const board = Gameboard()
    
    const players = [{name: "Player One", token: "X"}, {name: "Player Two", token: "O"}]

    let activePlayer = players[0]

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const getActivePlayer = () => activePlayer

    const printNewRound = () => {
        board.printBoard()
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getValue() !== 0) return

        console.log(`Placing ${getActivePlayer.name}'s token into row ${row}, column ${col}...`)

        board.placeToken(row, col, getActivePlayer().token)

        switchPlayerTurn()
        printNewRound()
    }

    printNewRound()

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}

const game = GameController()
game.playRound(0, 1)
game.playRound(1, 1)
game.playRound(1, 1)
game.playRound(1, 1)
