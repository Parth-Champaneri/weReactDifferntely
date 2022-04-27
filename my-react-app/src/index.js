import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={`square ${props.won ? 'winningSq' : ''}`}
      onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i, winSq) {
    return (<Square
      key={'sq' + i}
      value={this.props.squares[i]}
      won={winSq}
      onClick={() => this.props.onClick(i)}
    />);
  }

  renderRow(r) {
    //r = row
    const squares = []
    const offset = r * 3; // 3 = number of squares per row
    for (var sq = 0; sq <= 2; sq++) {
      const index = sq + offset;
      const winningSq = this.props.winners ? this.props.winners.includes(index) : false;

      squares.push(
        this.renderSquare(index, winningSq)
      )
    }
    return (
      <div key={'row' + r} className="board-row">
        {squares}
      </div>
    )
  }

  render() {


    const rows = []

    for (var x = 0; x <= 2; x++) {
      rows.push(this.renderRow(x));
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stepNumber: 0,
      isAsc: true,
      history: [{ squares: Array(9).fill(null), }],
      xIsNext: true,
      winningSquares: [],
    }
  }
  handleClick(i) {
    const position = [i % 3, Math.floor(i / 3)];

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      stepNumber: history.length,
      history: history.concat(
        [{
          squares: squares,
          move: position,
        }]
      ),

      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleMoves() {
    this.setState({
      isAsc: !this.state.isAsc,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    //show moves
    const isAsc = this.state.isAsc ? '1' : '2'
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={isAsc + move}>
          <button className={this.state.stepNumber === move ? 'active' : 'inactive'} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winners={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isAsc ? moves : moves.reverse()}</ol>
          <div>
            <button onClick={() => this.toggleMoves()}>
              Toggle
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
