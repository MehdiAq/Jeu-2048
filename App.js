class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: null,
      score: 0,
      gameOver: false,
      message: null,
    };
  }

  initializeBoard = (n) => {
    let board = new Array(n).fill(0).map(() => new Array(n).fill(0));
    board = this.initializeEmptyTile(this.initializeEmptyTile(board));
    this.setState({ board, score: 0, gameOver: false, message: null });
  };

  initializeEmptyTile = (board) => {
    let r, c;
    do {
      r = Math.floor(Math.random() * board.length);
      c = Math.floor(Math.random() * board.length);
    } while (board[r][c] !== 0);
    const initValues = [2, 4];
    board[r][c] = initValues[Math.floor(Math.random() * 2)];
    return board;
  };

  compact = (board) => {
    const compactedBoard = new Array(board.length)
      .fill(0)
      .map(() => new Array(board.length).fill(0));
    for (let r = 0; r < board.length; r++) {
      let colIndex = 0;
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] !== 0) {
          compactedBoard[r][colIndex] = board[r][c];
          colIndex++;
        }
      }
    }
    return compactedBoard;
  };

  merge = (board) => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length - 1; c++) {
        if (board[r][c] !== 0 && board[r][c] === board[r][c + 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c + 1] = 0;
        }
      }
    }

    return board;
  };

  reverse = (board) => {
    const reversedBoard = new Array(board.length)
      .fill(0)
      .map(() => new Array(board.length).fill(0));

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        reversedBoard[r][c] = board[r][board[r].length - 1 - c];
      }
    }

    return reversedBoard;
  };

  rotateLeft = (board) => {
    const rotatedBoard = new Array(board.length)
      .fill(0)
      .map(() => new Array(board.length).fill(0));

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        rotatedBoard[r][c] = board[c][board[r].length - 1 - r];
      }
    }

    return rotatedBoard;
  };

  rotateRight = (board) => {
    const rotatedBoard = new Array(board.length)
      .fill(0)
      .map(() => new Array(board.length).fill(0));

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        rotatedBoard[r][c] = board[board[r].length - 1 - c][r];
      }
    }

    return rotatedBoard;
  };

  compressLeft = (board) => {
    const movedLeftBoard = this.compact(this.merge(this.compact(board)));
    if (JSON.stringify(movedLeftBoard) === JSON.stringify(board)) {
      return board;
    }
    this.initializeEmptyTile(movedLeftBoard);
    this.setState({
      board: movedLeftBoard,
      score: this.state.score + 1,
    });
    return movedLeftBoard;
  };

  compressRight = (board) => {
    const movedRightBoard = this.reverse(
      this.compact(this.merge(this.compact(this.reverse(board))))
    );
    if (JSON.stringify(movedRightBoard) === JSON.stringify(board)) {
      return board;
    }
    this.initializeEmptyTile(movedRightBoard);
    this.setState({
      board: movedRightBoard,
      score: this.state.score + 1,
    });
    return movedRightBoard;
  };

  compressUp = (board) => {
    const movedUpBoard = this.rotateRight(
      this.compact(this.merge(this.compact(this.rotateLeft(board))))
    );
    if (JSON.stringify(movedUpBoard) === JSON.stringify(board)) {
      return board;
    }
    this.initializeEmptyTile(movedUpBoard);
    this.setState({
      board: movedUpBoard,
      score: this.state.score + 1,
    });
    return movedUpBoard;
  };

  compressDown = (board) => {
    const movedDownBoard = this.rotateLeft(
      this.compact(this.merge(this.compact(this.rotateRight(board))))
    );
    if (JSON.stringify(movedDownBoard) === JSON.stringify(board)) {
      return board;
    }
    this.initializeEmptyTile(movedDownBoard);
    this.setState({
      board: movedDownBoard,
      score: this.state.score + 1,
    });
    return movedDownBoard;
  };

  componentWillMount() {
    this.initializeBoard(4);
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  hasValue = (board, value) => {
    return board.some((row) => row.includes(value));
  };

  isFull = (board) => {
    return !board.some((row) => row.includes(0));
  };

  isGameOver = (board) => {
    if (this.hasValue(board, 2048)) {
      alert("2048 atteint !!! Vous avez gagné !!!");
      this.setState({
        gameOver: true,
        message: "Cliquez sur 'Commencer' pour rejouer",
      });
      return true;
    }
    if (this.isFull(board)) {
      alert("Perdu! Vous pouvez réessayer!");
      this.setState({
        gameOver: true,
        message: "Cliquez sur 'Commencer' pour rejouer",
      });
      return true;
    }
    return false;
  };

  handleKeyDown(e) {
    if (this.state.gameOver) {
      alert("Cliquez sur 'Commencer' pour rejouer");
      return;
    }
    if (!this.isGameOver(this.state.board)) {
      switch (e.key) {
        case "ArrowUp":
          this.compressUp(this.state.board);
          break;
        case "ArrowDown":
          this.compressDown(this.state.board);
          break;
        case "ArrowLeft":
          this.compressLeft(this.state.board);
          break;
        case "ArrowRight":
          this.compressRight(this.state.board);
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <div>
        <div
          className="button"
          onClick={() => {
            this.initializeBoard(4);
          }}
        >
          Commencer
        </div>

        <h3>Score: {this.state.score}</h3>

        <table>
          {this.state.board.map((row, i) => (
            <Row key={i} row={row} />
          ))}
        </table>

        <p>{this.state.message}</p>
      </div>
    );
  }
}

const Row = ({ row }) => {
  return (
    <tr>
      {row.map((cell, i) => (
        <Cell key={i} cellValue={cell} />
      ))}
    </tr>
  );
};

const Cell = ({ cellValue }) => {
  let color = "tile";
  let value = cellValue === 0 ? "" : cellValue;
  if (value) {
    color += ` color-${value}`;
  }

  return (
    <td>
      <div className={color}>
        <div className="tile-value">{value}</div>
      </div>
    </td>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
