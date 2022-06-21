
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
    const _gameArr = [];

    let currentTurn = player1; //First player to begin

    const makeMove = (move, position) => {
        _gameArr[position] = move;
        console.log(_gameArr)
    };

    const gameResult = () => {
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

        for (let i=0; i<= 6; i=+3){  //check horizontal matches
            matchCount = {'X': 0, 'O': 0}; //reset matches
            for (let j=i; j<=i+2; j++){
                if (_gameArr[i] === _gameArr[j]){
                    matchCount[_gameArr[i]]++;
                }

                if (matchCount['X'] === 3) return 'X';
                if (matchCount['O'] === 3) return 'O';
            }


        }
        if (Object.values(_gameArr).length == _gameArr.length) return "Tie";

        return false;

    }
    return {
        makeMove,
        gameResult,
        currentTurn,
    }
})();

const displayController = (() => {

    const restartBut = document.querySelector(".restart-game");
    const gameGrids = document.querySelectorAll(".game-grid");
    const gameGridsArr = [...gameGrids];
    const playerScoreCard = document.querySelector(".player-score");
    const opponentScoreCard = document.querySelector(".opponent-score");

    const markMove = (elm, position) => {
        if (elm.innerText === "X" || elm.innerText === "O") return;
        elm.innerText = gameBoard.currentTurn.move;
        gameBoard.makeMove(gameBoard.currentTurn.move, position)
        gameBoard.currentTurn === player1 ? gameBoard.currentTurn = player2 : gameBoard.currentTurn = player1;
    }

    gameGridsArr.forEach((grid, index) => grid.addEventListener('click', (event) => {
        markMove(event.target, index);
    
    }))

})();

