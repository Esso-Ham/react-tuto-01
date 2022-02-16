import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button
            className="square" 
            onClick={props.onCLICK}
        >
          {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    
    renderSquare(i) {
      return <Square 
                value={this.props.squares[i]}
                onCLICK={ () => this.props.onClick(i) }
            />;
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}
  
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares : Array(9).fill(null),
                marker : [0, 0],
            }],            
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        //console.log(history, current);
        //console.log(this.state.stepNumber);
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        let marker = repere(i);
        //console.log(marker);
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                marker: marker,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
        //console.log(current.marker);
        //console.log(history);
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {

        const history = this.state.history;
        //console.log(history);
        const current_step = history.length - 1;        
        const current = history[current_step];
        //console.log(current);
        console.log(current_step);
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move, obj) => {
            //console.log('step', step);
            console.log('move', move);
            //console.log('obj', obj);
            const desc = move ?
                'Revenir au tour n°' + move + ' | C:' + step.marker[0] + ' & ' + step.marker[1]:
                'Revenir au début de la partie';
            return (
                <li key={move} className={(current_step === move) ? "text-bold" : ""}>
                    <button 
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = winner + ' a gagné';
        } else {
            status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board  
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
        return squares[a];
      }
    }
    return null;
}

function repere(step, line_num, column_num){
    line_num = (typeof line_num !== 'undefined') ? line_num : 3;
    column_num = (typeof column_num !== 'undefined') ? column_num : 3;
    let line = Math.ceil((step+1)/column_num);
    let column = ((column_num -((column_num * line ) - step)+1));
    return [column, line];
}