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
    this.setState({ board: board, score: 0, gameOver: false, message: null });
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

  mirror = (board) => {
    const mirroredBoard = new Array(board.length)
      .fill(0)
      .map(() => new Array(board.length).fill(0));

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        mirroredBoard[r][c] = board[r][board[r].length - 1 - c];
      }
    }

    return mirroredBoard;
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
    return this.compact(this.merge(this.compact(board)));
  };

  compressRight = (board) => {
    return this.mirror(
      this.compact(this.merge(this.compact(this.mirror(board))))
    );
  };

  compressUp = (board) => {
    return this.rotateRight(
      this.compact(this.merge(this.compact(this.rotateLeft(board))))
    );
  };

  compressDown = (board) => {
    return this.rotateLeft(
      this.compact(this.merge(this.compact(this.rotateRight(board))))
    );
  };

  componentWillMount = () => {
    this.initializeBoard(4);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  };

  checkIfGameIsOver = (board) => {
    if (this.state.gameOver) {
      alert("La partie est finie. Cliquez sur 'Recommencer' pour rejouer");
      return;
    }
    // On déclare la partie gagnée si le joueur a atteint 2048
    if (board.some((row) => row.includes(2048))) {
      this.setState({
        board: board,
        score: this.state.score + 1,
        gameOver: true,
        message: "Cliquez sur 'Recommencer' pour rejouer",
      });
      alert("2048 atteint !!! Vous avez gagné !!!");
      return;
    }
    // On déclare la partie terminée s'il n'y a plus aucun mouvement
    // possible permettant de fusionner des tuiles, sinon on laisse
    // au joueur la possibilité d'essayer les différents mouvements
    if (
      JSON.stringify(board) === JSON.stringify(this.compressUp(board)) &&
      JSON.stringify(board) === JSON.stringify(this.compressDown(board)) &&
      JSON.stringify(board) === JSON.stringify(this.compressLeft(board)) &&
      JSON.stringify(board) === JSON.stringify(this.compressRight(board))
    ) {
      this.setState({
        board: board,
        score: this.state.score + 1,
        gameOver: true,
        message: "Cliquez sur 'Recommencer' pour rejouer",
      });
      alert("Perdu! Vous pouvez réessayer!");
      return;
    }
    // Mettre à jour le score et le tableau s'il a été changé et que la partie
    // n'est pas finie
    if (JSON.stringify(board) !== JSON.stringify(this.state.board)) {
      this.initializeEmptyTile(board);
      this.setState({
        board: board,
        score: this.state.score + 1,
      });
    }
  };

  handleKeyDown(e) {
    let board;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        board = this.compressUp(this.state.board);
        break;
      case "ArrowDown":
        e.preventDefault();
        board = this.compressDown(this.state.board);
        break;
      case "ArrowLeft":
        e.preventDefault();
        board = this.compressLeft(this.state.board);
        break;
      case "ArrowRight":
        e.preventDefault();
        board = this.compressRight(this.state.board);
        break;
      default:
        return;
    }
    this.checkIfGameIsOver(board);
  }

  render() {
    return (
      <div>
        <div class="button">
          <a href="index.html">Revenir</a>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.initializeBoard(
              parseInt(document.getElementById("boardSize").value)
            );
          }}
        >
          {/* J'ai limité la grandeur du tableau à 15 pour que le tableau fit dans une
          page sans avoir à scroller */}
          <label for="boardSize">Entrez la taille du tableau</label>
          <input
            type="number"
            id="boardSize"
            min="2"
            max="15"
            placeholder="Entre 2 et 15"
            required
          />
          <input type="submit" class="button" value="Recommencer" />
        </form>

        <h3>Score: {this.state.score}</h3>

        <table>
          {this.state.board.map((row, i) => (
            <Row key={i} row={row} />
          ))}
        </table>

        <p>{this.state.message}</p>

        <Instructions />
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

const Instructions = () => {
  return (
    <div id="instructions">
      <p>
        <strong><u>Instructions:</u></strong> Utiliser les touches directionnelles du{" "}
        <strong>clavier</strong> pour bouger les tuiles: Droite, Gauche, Haut,
        Bas. Les tuiles voisines avec les même valeurs vont fusionner. Continuez
        jusqu'à atteindre <strong>2048!</strong> La partie termine si le tableau
        est plein et qu'il n'existe plus de mouvement pouvant fusionner des
        tuiles.
      </p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
