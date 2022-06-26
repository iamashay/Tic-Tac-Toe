
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

const gameBoard = (() => {
    let _gameArr = Array(9);

    let currentTurn = player1; //First player to begin
    let continueGameStatus = true;

    const makeMove = (move, position) => {
        _gameArr[position] = move;
    };

    const gameResult = () => {
        
        if (!continueGameStatus) return false;

        let matchCount = {'X': 0, 'O': 0}; //initiate matches object

        for (let i=0; i<= 2; i++){ //check vertical matches
            matchCount = {'X': 0, 'O': 0}; //reset matches
            for (let j=i; j<=i+6; j+=3){
                if (_gameArr[i] === _gameArr[j]){
                    matchCount[_gameArr[i]]++;
                }
                if (matchCount['X'] === 3) return 'X';
                if (matchCount['O'] === 3) return 'O';
            }

            if (i === 0 || i === 2){ //check diagonal matches
                matchCount = {'X': 0, 'O': 0}; //reset matches
                let addFactor = 0;
                i === 0 ? addFactor = 4 : addFactor = 2;
                for (let x = i; x <= i+addFactor*2; x+=addFactor){
                    if (_gameArr[i] === _gameArr[x]){
                        matchCount[_gameArr[i]]++;
                    }
                    if (matchCount['X'] === 3) return 'X';
                    if (matchCount['O'] === 3) return 'O';
                }
            }


        }

        for (let i=0; i<= 6; i+=3){  //check horizontal matches
            matchCount = {'X': 0, 'O': 0}; //reset matches
            for (let j=i; j<=i+2; j++){
                if (_gameArr[i] === _gameArr[j]){
                    matchCount[_gameArr[i]]++;
                }

                if (matchCount['X'] === 3) return 'X';
                if (matchCount['O'] === 3) return 'O';
            }


        }
        if (Object.values(_gameArr).length == 9) return "Tie";

        return false;

    }

    const getResult = () => {
        let currentResult = gameResult();
        if (player1.move === currentResult){
            player1.score += 1;
            continueGameStatus = false;
        }else if(player2.move === currentResult){
            player2.score += 1;
            continueGameStatus = false;
        }
        return currentResult;
    }

    const getGameStatus = () => continueGameStatus;



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

    const getComputerMoveIndex = (computer) => {
        let emptyIndexArr = getEmptyMovesIndex();
        compRandom = Math.floor(Math.random() * (emptyIndexArr.length-1));
        compMoveIndex = emptyIndexArr[compRandom];
        return compMoveIndex;
    }

    const reset = () => {
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
        currentTurn,
        getGameStatus,
        continueGame,
        getComputerMoveIndex,
        reset
    }
})();

const displayController = (() => {

    const restartBut = document.querySelector(".restart-game");
    const gameGrids = document.querySelectorAll(".game-grid");
    const gameGridsArr = [...gameGrids];
    const playerScoreCard = document.querySelector(".player-score");
    const opponentScoreCard = document.querySelector(".opponent-score");
    const gameMsg = document.querySelector(".game-message");
    const continueGamePopup = document.querySelector(".continue-popup");
    const continueGameBut = document.querySelector(".continue-but");
    const chooseOpponentDiv = document.querySelector('.choose-opponent')
    const humanChoiceCard = document.querySelector(".human-opponent");
    const opponentChoiceCard = document.querySelector(".computer-opponent");
    const secondHumanNameInput = document.querySelector("#second-name-input");
    const secondPlayerNameBox = document.querySelector(".second-player-name-box");
    const startBut = document.querySelector(".start-button");
    const counterMsg = document.querySelector(".counter-msg");
    const choiceContainer = document.querySelector(".choice-container");
    const gameContainer = document.querySelector(".game-container");
    const loginContainer = document.querySelector(".login-container")
    const firstHumanNameInput = document.querySelector("#first-name-input");
    const playerUsername = document.querySelector(".player-username");
    const opponentUsername = document.querySelector(".opponent-username")
    const opponentIcon = document.querySelector(".opponent img");

    const opponentHumanIconRes = "https://icons.iconarchive.com/icons/diversity-avatars/avatars/48/andy-warhol-icon.png";
    const opponentComputerIconRes = "./res/robot.png";


    const displayTurn = () => {
        gameMsg.textContent = `${gameBoard.currentTurn.name}'s turn!`;
    }

    const toggleTurn = () => {
        gameBoard.currentTurn === player1 ? gameBoard.currentTurn = player2 : gameBoard.currentTurn = player1;
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

        if (elm.textContent === "X" || elm.textContent === "O") return;
        elm.textContent = gameBoard.currentTurn.move;
        gameBoard.makeMove(gameBoard.currentTurn.move, position)
        toggleTurn();
        displayTurn();
        updateResult();
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
        gameMsg.textContent = `Game started! ${gameBoard.currentTurn.name}'s turn!`
        if (gameBoard.currentTurn === player2 && !player2.isHuman) compMarkMove();
    }

    const toggleSecondPlayerBox = () => {
        if (!secondPlayerNameBox.style.display || secondPlayerNameBox.style.display  === 'none')
            secondPlayerNameBox.style.display = "flex";
        else secondPlayerNameBox.style.display = "none";
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
            startGameClickEvent();
        }
    }

    const compMarkMove = () => {
        let moveIndex = gameBoard.getComputerMoveIndex();
        markMove(gameGrids[moveIndex], moveIndex);
    }

    gameGridsArr.forEach((grid, index) => grid.addEventListener('click', (event) => {
        if (gameBoard.currentTurn === player1) {
            markMove(event.target, index);
        }
        if(gameBoard.currentTurn === player2){
            player2.isHuman ? markMove(event.target, index) : compMarkMove();
        }
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
        }

        playerUsername.textContent = player1.name; //set username for the game screen score card
        opponentUsername.textContent = player2.name;

        toggleCounterMsg();
        toggleChoiceContainer(); 
        startCounter();
    }

    const reset = () => {

        toggleGameContainer();
        toggleLoginContainer();
        secondHumanNameInput.value = "";
        humanChoiceCard.style.display = "";
        opponentChoiceCard.style.display = "";
        opponentChoiceCard.style.opacity = "";
        humanChoiceCard.style.opacity = "";
        clearGameGrids();
        gameBoard.reset();
        toggleSecondPlayerBox();

        if (gameBoard.getGameStatus()) continueGamePopup.style.display = "none";
        playerScoreCard.textContent = "(0)"
        opponentScoreCard.textContent = "(0)"
    }

    secondPlayerNameBox.addEventListener("submit", startGameClickEvent)
    humanChoiceCard.addEventListener('click', chooseOpponent)
    opponentChoiceCard.addEventListener('click', chooseOpponent)

    continueGameBut.addEventListener("click", continueGameDisplay)
    loginContainer.addEventListener("submit", loginGameEvent)
    restartBut.addEventListener("click", reset)
})();

