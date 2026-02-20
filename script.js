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
            return true
        }

        return false
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

function GameController(playerOneName, playerTwoName) {
    const board = Gameboard()
    
    const players = [{name: playerOneName || "Player One", token: "X"}, {name: playerTwoName || "Player Two", token: "O"}]

    const getPlayers = () => players

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
                && gameState[0][i].getValue() !== 0){
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
        const success = board.placeToken(row, col, getActivePlayer().token)

        if (!success) return

        console.log(`Placing ${getActivePlayer().name}'s token into row ${row}, column ${col}...`)

        if (checkGameState()){
            return "won"
        }

        if(checkAvailableTiles()){
            switchPlayerTurn()
            printNewRound()
        } else{
            return "draw"
        }
    }

    printNewRound()

    return {
        playRound,
        getActivePlayer,
        checkGameState,
        checkAvailableTiles,
        getBoard: board.getBoard,
        getPlayers
    }
}

function ScreenController() {
    let game = GameController()
    let gameOver = false
    let playerOneScore = 0
    let playerTwoScore = 0
    const startScreen = document.querySelector('.start-screen')
    const startButton = document.querySelector('.start')
    const playerTurnDiv = document.querySelector('.turn')
    const boardDiv = document.querySelector('.board')
    const resetButton = document.querySelector('.reset')
    const dialog = document.querySelector('dialog')
    const addPlayerNameButton = document.querySelector('.player-names')
    const form = document.querySelector('form')
    const scoreboard = document.querySelector('.scoreboard')

    addPlayerNameButton.addEventListener("click", () => {
        dialog.showModal()
    })

    let playerOneName
    let playerTwoName

    function getPlayerNames(e) {
        e.preventDefault()
        playerOneName = document.querySelector("#player1").value
        playerTwoName = document.querySelector("#player2").value

        game = GameController(playerOneName, playerTwoName)
        dialog.close()
    }
    form.addEventListener("submit", getPlayerNames)

    function startGame() {
        startScreen.classList.add("hidden")
        startScreen.classList.remove("start-screen")
        playerTurnDiv.classList.remove("hidden")
        boardDiv.classList.remove("hidden")
        resetButton.classList.remove("hidden")
        scoreboard.classList.remove("hidden")
        updateScreen()
    }
    startButton.addEventListener("click", startGame)

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard()
        const activePlayer = game.getActivePlayer()

        if(!gameOver) playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
        
        const p1Score = document.querySelector('.p1-score')
        p1Score.textContent = `${game.getPlayers()[0].name}: ${playerOneScore}`
        const p2score = document.querySelector('.p2-score')
        p2score.textContent = `${game.getPlayers()[1].name}: ${playerTwoScore}`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button")
                cellButton.classList.add("cell")
                cellButton.dataset.row = rowIndex
                cellButton.dataset.column = colIndex
                if(cell.getValue() != 0){
                    cellButton.textContent = cell.getValue()
                }
                boardDiv.append(cellButton)
            })
        })
    }

    function clickHandler(e) {
        if (!e.target.classList.contains("cell") || gameOver) return

        const selectedRow = Number(e.target.dataset.row)
        const selectedCol = Number(e.target.dataset.column)

        const result = game.playRound(selectedRow, selectedCol)

        if(result === "won"){
            switch (game.getActivePlayer().token) {
                case "X":
                    playerOneScore++
                    break
                case "O":
                    playerTwoScore++
                    break
            }
            updateScreen()
            playerTurnDiv.textContent = `${game.getActivePlayer().name} won!`
            gameOver = true
        } else if(result === "draw"){
            updateScreen()
            playerTurnDiv.textContent = "It's a draw."
            gameOver = true
        } else {
            updateScreen()
        }
    }
    boardDiv.addEventListener("click", clickHandler)

    function resetGame() {
        game = GameController(playerOneName, playerTwoName)
        gameOver = false
        updateScreen()
    }
    resetButton.addEventListener("click", resetGame)
}

ScreenController()