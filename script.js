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

    const checkGameState = () => {
        const gameState = board.getBoard()

        for(let i = 0; i < 3; i++){
            if (gameState[i][0].getValue() === gameState[i][1].getValue() 
                && gameState[i][0].getValue() === gameState[i][2].getValue() 
                && gameState[i][0].getValue() !== 0){
                    return true
                }
            if (gameState[0][i].getValue() === gameState[1][i].getValue() 
                && gameState[0][i].getValue() === gameState[2][i].getValue() 
                && gameState[i][0].getValue() !== 0){
                    return true
                }
        }

        if (gameState[0][0].getValue() === gameState[1][1].getValue() 
            && gameState[0][0].getValue() === gameState[2][2].getValue() 
            && gameState[0][0].getValue() !== 0){
                return true
            }
        if (gameState[0][2].getValue() === gameState[1][1].getValue() 
            && gameState[0][2].getValue() === gameState[2][0].getValue() 
            && gameState[0][2].getValue() !== 0){
                return true
            }

        return false
    }

    const checkAvailableTiles = () => {
        const gameState = board.getBoard()

        return gameState.some(row => row.some(cell => cell.getValue() === 0))
    }

    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getValue() !== 0) return

        console.log(`Placing ${getActivePlayer().name}'s token into row ${row}, column ${col}...`)

        board.placeToken(row, col, getActivePlayer().token)

        if (checkGameState()){
            return console.log(`${getActivePlayer().name} won!`)
        }

        if(checkAvailableTiles()){
            switchPlayerTurn()
            printNewRound()
        } else{
            board.printBoard()
            return console.log("It's a draw")
        }
    }

    printNewRound()

    return {
        playRound,
        getActivePlayer,
        checkGameState,
        checkAvailableTiles,
        getBoard: board.getBoard
    }
}

const game = GameController()
game.playRound(0, 0)
game.playRound(1, 1)
game.playRound(0, 1)
game.playRound(0, 2)
game.playRound(2, 0)
game.playRound(1, 0)
game.playRound(1, 2)
game.playRound(2, 1)
game.playRound(2, 2)