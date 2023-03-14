const Player = (name, mark) => {
  const playTurn = (board, cell) => {
    const index = board.cells.findIndex(position => position === cell);
    if (board.boardArray[index] === '') {
      board.render();
      return index;
    }
    return null;
  };

  return { name, mark, playTurn };
};

const boardModule = (() => {
  let boardArray = ['', '', '', '', '', '', '', '', ''];
  const gameBoard = document.querySelector('#board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  let winner = null;

  const render = () => {
    boardArray.forEach((mark, index) => {
      cells[index].textContent = boardArray[index];
    });
  };

  const reset = () => {
    boardArray = ['', '', '', '', '', '', '', '', ''];
  };

  const checkWin = () => {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    winCombos.forEach((combo) => {
      if (boardArray[combo[0]]
        && boardArray[combo[0]] === boardArray[combo[1]]
        && boardArray[combo[0]] === boardArray[combo[2]]) {
        winner = boardArray[combo[0]];
      }
    });
    return winner || (boardArray.includes('') ? null : 'Tie');
  };

  return {
    render, gameBoard, cells, boardArray, checkWin, reset,
  };
})();

const gamePlay = (() => {
  const playerOneName = document.getElementById('player1');
  const playerTwoName = document.getElementById('player2');
  const form = document.querySelector('.player-info');
  const resetBtn = document.querySelector('#reset');
  let currentPlayer;
  let playerOne;
  let playerTwo;

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const gameRound = () => {
    const board = boardModule;
    const gameStatus = document.querySelector('.game-status');
    if (currentPlayer.name !== '') {
      gameStatus.textContent = `${currentPlayer.name}'s turn`;
    }

    board.gameBoard.addEventListener('click', (event) => {
      event.preventDefault();
      const play = currentPlayer.playTurn(board, event.target);
      if (play !== null) {
        board.boardArray[play] = `${currentPlayer.mark}`;
        board.render();
        const winStatus = board.checkWin();
        if (winStatus === 'Tie') {
          gameStatus.textContent = 'Tie!';
        } else if (winStatus === null) {
          switchTurn();
          gameStatus.textContent = `${currentPlayer.name}'s turn`;
        } else {
          gameStatus.textContent = `Winner is ${currentPlayer.name}`;
          board.reset();
          board.render();
        }
      }
    });
  };

  const gameInit = () => {
    if (playerOneName.value !== '' && playerTwoName.value !== '') {
      playerOne = Player(playerOneName.value, 'X');
      playerTwo = Player(playerTwoName.value, 'O');
      currentPlayer = playerOne;
      gameRound();
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (playerOneName.value !== '' && playerTwoName.value !== '') {
      gameInit();
      document.querySelector('.welcome').classList.add('hidden');
      document.querySelector('.gameboard').classList.remove('hidden');
    } else {
      window.location.reload();
    }
  });

  resetBtn.addEventListener('click', () => {
    document.querySelector('#player1').value = '';
    document.querySelector('#player2').value = '';
    window.location.reload();
  });
  return {
    gameInit,
  };
})();

gamePlay.gameInit();