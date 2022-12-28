const player = (name, move, isHuman=true) => {
    let score = 0;
    return {
        name,
        score,
        move,
        isHuman
    }
};

let player1 = player("", "X");
let player2 = player("", "O");

const gameBoard = (() => { //controls all the logic of the game
    let _gameArr = Array(9); //moves are places in this array

    let currentTurn = player1; //First player to begin
    let continueGameStatus = true;

    const makeMove = (move, position) => {
        _gameArr[position] = move;
    };

    const generateRandomNumber = (limit) => {
        return Math.floor(Math.random() * (limit));
    }

    const gameResult = (gameArr = _gameArr) => { //checks if someone has won or not
        
        if (!continueGameStatus) return false;

        if (gameArr[0] == gameArr[1] && gameArr[1] == gameArr[2] ||
            gameArr[0] == gameArr[3] && gameArr[3] == gameArr[6] ||
            gameArr[0] == gameArr[4] && gameArr[4] == gameArr[8]) {
            return gameArr[0];
        }

        if (gameArr[2] == gameArr[4] && gameArr[4] == gameArr[6] ||
            gameArr[2] == gameArr[5] && gameArr[5] == gameArr[8]) {
            return gameArr[2];
        }

        if (gameArr[4] == gameArr[1] && gameArr[1] == gameArr[7] ||
            gameArr[4] == gameArr[3] && gameArr[3] == gameArr[5]) {
            return gameArr[4];
        }

        if (gameArr[6] == gameArr[7] && gameArr[7] == gameArr[8]) {
            return gameArr[6];
        }
        
        
        
        if (Object.values(gameArr).length == 9) return "Tie";

        return false;

    }

    const getResult = () => { //updates score
        let currentResult = gameResult();
        if (player1.move === currentResult){
            player1.score += 1;
            continueGameStatus = false;
        }else if(player2.move === currentResult){
            player2.score += 1;
            continueGameStatus = false;
        }else if(currentResult === "Tie"){
            continueGameStatus = false;
        }
        return currentResult;
    }

    const getGameStatus = () => continueGameStatus;
    
    const getCurrentTurn = () => currentTurn;
    
    const setCurrentTurn = (value) => currentTurn = value;

    const getGridArrayLength = () => Object.values(_gameArr).length;

    const continueGame = () => {
        continueGameStatus = true;
        _gameArr = Array(9);
    }

    const getEmptyMovesIndex = () => {
        const emptyIndexArr = []

        for (let index = 0; index < _gameArr.length; index++){
            if (!_gameArr[index]) 
                emptyIndexArr.push(index);
        }
        return emptyIndexArr;
    }

    const getComputerMoveIndex = (isAI = false) => { //returns a move index for the computer
        let ai = "O"
        let emptyIndexArr = getEmptyMovesIndex();
        let bestScore = Infinity;
        let bestMoveIndex;
        if (!isAI){        
            compRandom = generateRandomNumber(emptyIndexArr.length-1);
            compMoveIndex = emptyIndexArr[compRandom];
            return compMoveIndex;
        }else {
            for (let i =0; i < _gameArr.length; i++){
                if (!_gameArr[i]){
                    _gameArr[i] = ai;
                    let score = minimax(_gameArr, true, 0);
                    delete _gameArr[i];
                    if (bestScore > score){
                        bestScore = score;
                        bestMoveIndex = i;
                    }
                    //console.log(bestScore)
                }
            }
            //console.log("Best move index", bestMoveIndex)
            return bestMoveIndex;
        }
    }


    const minimax = (gameArr, isMax = true, depth) => { //minimax algorithm returning the best move with lowest depth
        const currentGameResult = gameResult(gameArr);
        if (currentGameResult === "Tie"){
            return 0
        }else if (currentGameResult === "X"){
            return 10 - depth
        }else if (currentGameResult === "O"){
            return depth - 10
        }
        

        if(isMax){
            let bestScore = -Infinity; //setting the score to Infinity for min, and depth to infinity to capture lowest depth
            for (let i =0; i < gameArr.length; i++){
                if (!gameArr[i]){
                    gameArr[i] = "X";

                    let score = minimax(gameArr, false, depth+1);
                    delete gameArr[i];
                    bestScore = Math.max(score, bestScore)
                }
            }
            return bestScore;
        }else{
            let bestScore = Infinity; //setting the score to Infinity for min, and depth to infinity to capture lowest depth

            for (let i =0; i < gameArr.length; i++){
                if (!gameArr[i]){
                    gameArr[i] = "O";
                    let score = minimax(gameArr, true, depth+1);
                    delete gameArr[i];
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }

    }

    const reset = () => { //reset the gameBoard
        _gameArr = Array(9);
        continueGameStatus = true;
        player1.name = "";
        player1.score = 0;
        player2.isHuman = true;
        player2.name = "";
        player2.score = 0;
        currentTurn = player1;
    }

    return {
        makeMove,
        getResult,
        getCurrentTurn,
        setCurrentTurn,
        getGameStatus,
        continueGame,
        getComputerMoveIndex,
        getGridArrayLength,
        reset
    }
})();

const displayController = (() => { //controls all the frontend relataed events 
    const restartBut = document.querySelector(".restart-game");
    const gameGrids = document.querySelectorAll(".game-grid");
    const gameGridsArr = [...gameGrids];
    const playerScoreCard = document.querySelector(".player-score");
    const opponentScoreCard = document.querySelector(".opponent-score");
    const gameMsg = document.querySelector(".game-message");
    const continueGamePopup = document.querySelector(".continue-popup");
    const continueGameBut = document.querySelector(".continue-but");
    const humanChoiceCard = document.querySelector(".human-opponent");
    const opponentChoiceCard = document.querySelector(".computer-opponent");
    const secondHumanNameInput = document.querySelector("#second-name-input");
    const secondPlayerNameBox = document.querySelector(".second-player-name-box");
    const counterMsg = document.querySelector(".counter-msg");
    const choiceContainer = document.querySelector(".choice-container");
    const gameContainer = document.querySelector(".game-container");
    const loginContainer = document.querySelector(".login-container")
    const firstHumanNameInput = document.querySelector("#first-name-input");
    const playerUsername = document.querySelector(".player-username");
    const opponentUsername = document.querySelector(".opponent-username")
    const opponentIcon = document.querySelector(".opponent img");
    const computerLevelBox = document.querySelector(".computer-level-box");
    const chooseDifficulty = document.querySelector("#difficulty-level");

    const opponentHumanIconRes = "https://icons.iconarchive.com/icons/diversity-avatars/avatars/48/andy-warhol-icon.png";
    const opponentComputerIconRes = "./res/robot.png";
    const aiIconRes = "./res/ai.png";
    
    let isComputerHard = false; //talks

    const enableGridClick = () => {
        gameGridsArr.forEach((grid) => {
            grid.style.pointerEvents = 'auto';
        })
    }

    const disableGridClick = () => {
        gameGridsArr.forEach((grid) => {
            grid.style.pointerEvents = 'none';
        })
    }

    const displayTurn = (isContinue) => {
        if (gameBoard.getGridArrayLength() === 0 && !isContinue){ 
            gameMsg.textContent = `Game started! ${gameBoard.getCurrentTurn().name}'s turn!`;
        }else {
            gameMsg.textContent = `${gameBoard.getCurrentTurn().name}'s turn!`;
        }

    }

    const toggleTurn = () => {
        gameBoard.getCurrentTurn() === player1 ? gameBoard.setCurrentTurn(player2) : gameBoard.setCurrentTurn(player1);
    }

    const updateResult = () => {
        let currentResult = gameBoard.getResult();
        if (currentResult === 'X'){
            playerScoreCard.textContent = `(${player1.score})`
            gameMsg.textContent = `${player1.name} won this round !`;
            toggleContinueGamePopup();
        }else if (currentResult === 'O'){
            opponentScoreCard.textContent = `(${player2.score})`
            gameMsg.textContent = `${player2.name} won this round !`;
            toggleContinueGamePopup();
        }else if (currentResult === 'Tie'){
            gameMsg.textContent = `It's a Tie`;
            toggleContinueGamePopup();
        }
    }

    const toggleContinueGamePopup = () => {
        if (!continueGamePopup.style.display || continueGamePopup.style.display  === 'none')
         continueGamePopup.style.display = "flex";
        else continueGamePopup.style.display = "none";
    }

    const markMove = (elm, position) => {
        if (!gameBoard.getGameStatus()) return;
        if (gameBoard.getCurrentTurn().name === "Computer") disableGridClick();
        elm.textContent = gameBoard.getCurrentTurn().move;
        gameBoard.makeMove(gameBoard.getCurrentTurn().move, position)
        toggleTurn();
        displayTurn();
        updateResult();

        if (gameBoard.getCurrentTurn().name === "Computer" && gameBoard.getGameStatus()) compMarkMove();

    }
    const clearGameGrids = () => {
        gameGridsArr.forEach((grid) => {
            grid.textContent = "";
        })
    }
    const continueGameDisplay = () => {
        gameBoard.continueGame();
        toggleContinueGamePopup()
        clearGameGrids();
        displayTurn(true);
        if (gameBoard.getCurrentTurn() === player2 && !player2.isHuman) compMarkMove();
    }

    const toggleSecondPlayerBox = () => {
        if (!secondPlayerNameBox.style.display || secondPlayerNameBox.style.display  === 'none')
            secondPlayerNameBox.style.display = "flex";
        else secondPlayerNameBox.style.display = "none";
    } 

    const toggleComputerLevelBox = () => {
        if (!computerLevelBox.style.display || computerLevelBox.style.display  === 'none')
            computerLevelBox.style.display = "flex";
        else 
            computerLevelBox.style.display = "none";
    } 

    const chooseOpponent = (elm) => {
        
        if(elm.currentTarget.className.indexOf("human") > -1){
            opponentChoiceCard.style.display = "none";
            humanChoiceCard.style.opacity = "1";
            toggleSecondPlayerBox();
            secondHumanNameInput.focus();
        }else if (elm.currentTarget.className.indexOf("computer") > -1) {
            humanChoiceCard.style.display = "none";
            opponentChoiceCard.style.opacity = "1";
            toggleComputerLevelBox();
        }
    }

    const compMarkMove = () => {
        let moveIndex = gameBoard.getComputerMoveIndex(isComputerHard);
        markMove(gameGrids[moveIndex], moveIndex);
        enableGridClick();
    }

    gameGridsArr.forEach((grid, index) => grid.addEventListener('click', (event) => {
        
        const elm = event.target;
        if (elm.textContent === "X" || elm.textContent === "O") return;
        markMove(elm, index);

    }))

    const toggleChoiceContainer = () => {
        if (!choiceContainer.style.display || choiceContainer.style.display  === 'none')
        choiceContainer.style.display = "flex";
        else choiceContainer.style.display = "none";
    }

    const toggleGameContainer = () => {
        if (!gameContainer.style.display || gameContainer.style.display  === 'none')
        gameContainer.style.display = "flex";
        else gameContainer.style.display = "none";
    }

    const toggleCounterMsg = () => {
        if (!counterMsg.style.display || counterMsg.style.display  === 'none')
        counterMsg.style.display = "flex";
        else counterMsg.style.display = "none";
    }

    const toggleLoginContainer = () => {
        if (!loginContainer.style.display || loginContainer.style.display  === 'none')
        loginContainer.style.display = "flex";
        else loginContainer.style.display = "none";
    }

    const loginGameEvent = (event) => {
        event.preventDefault();
        toggleLoginContainer();
        toggleChoiceContainer();
        player1.name = firstHumanNameInput.value;
    };

    const startCounter = () => {
        let gameCounter = 3;
        counterMsg.textContent = `Starting game in ${--gameCounter}`;
        let counterInterval = setInterval(()=>{
            counterMsg.textContent = `Starting game in ${--gameCounter}`
            if (gameCounter <= 0){
                clearInterval(counterInterval);
                toggleCounterMsg();
                toggleGameContainer();
            }
        }, 1000)
    }

    const startGameClickEvent = (event) => {
        if (event) event.preventDefault(); //used in form event listener and with computer choice icon
        if (secondHumanNameInput.value) {
            player2.name = secondHumanNameInput.value;
            opponentIcon.src = opponentHumanIconRes;
            opponentIcon.alt = "opponent-human-icon";
        }else {
            player2.name = "Computer";
            player2.isHuman = false;
            opponentIcon.src = opponentComputerIconRes;
            opponentIcon.alt = "opponent-computer-icon";
            if (chooseDifficulty.value === "hard"){
                isComputerHard = true;
                opponentIcon.src = aiIconRes;
            }
        }

        playerUsername.textContent = player1.name; //set username for the game screen score card
        opponentUsername.textContent = player2.name;
        displayTurn();
        toggleCounterMsg();
        toggleChoiceContainer(); 
        startCounter();
    }

    const reset = () => {
        player2.isHuman ? toggleSecondPlayerBox() : toggleComputerLevelBox();
        toggleGameContainer();
        toggleLoginContainer();
        secondHumanNameInput.value = "";
        humanChoiceCard.style.display = "";
        opponentChoiceCard.style.display = "";
        opponentChoiceCard.style.opacity = "";
        humanChoiceCard.style.opacity = "";
        isComputerHard = false;
        enableGridClick();
        clearGameGrids();
        gameBoard.reset();
        if (gameBoard.getGameStatus()) continueGamePopup.style.display = "none";
        playerScoreCard.textContent = "(0)";
        opponentScoreCard.textContent = "(0)";
    }

    secondPlayerNameBox.addEventListener("submit", startGameClickEvent)
    computerLevelBox.addEventListener("submit", startGameClickEvent)
    humanChoiceCard.addEventListener('click', chooseOpponent)
    opponentChoiceCard.addEventListener('click', chooseOpponent)

    continueGameBut.addEventListener("click", continueGameDisplay)
    loginContainer.addEventListener("submit", loginGameEvent)
    restartBut.addEventListener("click", reset)
})();

