
const player = (name, move) => {
    let score = 0;
    return {
        name,
        score,
        move
    }
};

const player1 = player("Ashay", "X")
const player2 = player("Rahul", "O")

const gameBoard = (() => {
    let _gameArr = [];

    let currentTurn = player1; //First player to begin
    let continueGameStatus = true;

    const makeMove = (move, position) => {
        _gameArr[position] = move;
        console.log(_gameArr)
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
        _gameArr = []

    }

    return {
        makeMove,
        getResult,
        currentTurn,
        getGameStatus,
        continueGame
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
    const computerChoiceCard = document.querySelector(".computer-opponent");
    const secondHumanNameInput = document.querySelector("#second-name-input");
    const secondPlayerNameBox = document.querySelector(".second-player-name-box");
    const startBut = document.querySelector(".start-button");
    const choiceMsg = document.querySelector(".choice-msg");
    const choiceContainer = document.querySelector(".choice-container");
    const gameContainer = document.querySelector(".game-container");


    const displayTurn = () => {
        gameMsg.innerText = `${gameBoard.currentTurn.name}'s turn!`;
    }

    const toggleTurn = () => {
        gameBoard.currentTurn === player1 ? gameBoard.currentTurn = player2 : gameBoard.currentTurn = player1;
    }

    const updateResult = () => {
        let currentResult = gameBoard.getResult();
        if (currentResult === 'X'){
            playerScoreCard.innerText = `(${player1.score})`
            gameMsg.innerText = `${player1.name} won this round !`;
            toggleContinueGamePopup();
        }else if (currentResult === 'O'){
            opponentScoreCard.innerText = `(${player2.score})`
            gameMsg.innerText = `${player2.name} won this round !`;
            toggleContinueGamePopup();
        }else if (currentResult === 'Tie'){
            gameMsg.innerText = `It's a Tie`;
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

        if (elm.innerText === "X" || elm.innerText === "O") return;
        elm.innerText = gameBoard.currentTurn.move;
        gameBoard.makeMove(gameBoard.currentTurn.move, position)
        toggleTurn();
        displayTurn();
        updateResult();
    }
    const clearGameGrids = () => {
        gameGridsArr.forEach((grid) => {
            grid.innerText = "";
        })
    }
    const continueGameDisplay = () => {
        gameBoard.continueGame();
        toggleContinueGamePopup()
        clearGameGrids();
        gameMsg.innerText = `Game started! ${gameBoard.currentTurn.name} turn!`
    }

    const toggleSecondPlayerBox = () => {
        if (!secondPlayerNameBox.style.display || secondPlayerNameBox.style.display  === 'none')
            secondPlayerNameBox.style.display = "flex";
        else secondPlayerNameBox.style.display = "none";
    } 

    const chooseOpponent = (elm) => {
        
        if(elm.currentTarget.className.indexOf("human") > -1){
            computerChoiceCard.style.display = "none";
            humanChoiceCard.style.opacity = "1";
            toggleSecondPlayerBox();
            secondHumanNameInput.focus();
            setTimeout(()=>chooseOpponentDiv.style.animation = "", 4000);
        }else if (elm.currentTarget.className.indexOf("computer") > -1) {
            humanChoiceCard.style.display = "none";
            computerChoiceCard.style.opacity = "1";
            setTimeout(()=>chooseOpponentDiv.style.animation = "", 400)
        }
    }

    gameGridsArr.forEach((grid, index) => grid.addEventListener('click', (event) => {
        markMove(event.target, index);
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

    const toggleChoiceMsg = () => {
        if (!choiceMsg.style.display || choiceMsg.style.display  === 'none')
        choiceMsg.style.display = "flex";
        else choiceMsg.style.display = "none";
    }


    const startGameClickEvent = (event) => {
        event.preventDefault();
        let gameCounter = 6;
        toggleChoiceContainer(); 
        choiceMsg.textContent = `Starting game in ${--gameCounter}`
        let counterInterval = setInterval(()=>{
            choiceMsg.textContent = `Starting game in ${--gameCounter}`
            if (gameCounter <= 0){
                clearInterval(counterInterval);
                toggleChoiceMsg();
                toggleGameContainer();
            }
        }, 1000)

    }

    secondPlayerNameBox.addEventListener("submit", startGameClickEvent)

    humanChoiceCard.addEventListener('click', chooseOpponent)
    computerChoiceCard.addEventListener('click', chooseOpponent)

    continueGameBut.addEventListener("click", continueGameDisplay)

})();

