import React, { Component } from "react";
import Board from "./components/Board";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xIsNext: true,
      stepNumber: 0,
      user: "",
      history: [{ squares: Array(9).fill(null) }],
    };
  }

  calculateWinner = (squares) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = this.calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({
        squares: squares,
      }),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  postData = async () => {
    let data = new URLSearchParams();

    data.append("player", this.state.user); // data that you want to post (key, value)
    data.append("score", "TIME_ELAPSED_IN_SECONDS"); // {player:"PLAYER_NAME", score : {TIME_ELAPSE_IN_SECOND}}

    const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
      json: true,
    });
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to #" + move : "Start the game";
      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = "Winner is " + winner;
    } else {
      status = "Next player is " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className = "background-game">
      <div className="game">
        <div className="game-text">
          <h1> Tic Toc Toe </h1>
          <h2><i>With My Friends</i></h2>
        </div>

        <div className="game-board">
          <div className="board">
            <Board
              onClick={(i) => this.handleClick(i)}
              squares={current.squares}
              postData={this.postData}
            />
          </div>

          <div className="">
            <div>{this.state.user}</div>
            <div div className="game-info">
              <div>{status}</div>
              <ul className="style-text" style={{ listStyleType: "none" }}>
                {moves}
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default App;
