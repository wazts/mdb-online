import React from 'react';
import ReactDOM from 'react-dom';

class NewGame extends React.Component {
  render() {
    return (
        <form id="join-game-form" action="">
            <input id="join_csrf" type="hidden" name="_csrf" value="csrf" />
            <input id="username" type="text" autocomplete="off" placeholder="username"/>
            <input id="gameName" type="text" autocomplete="off" placeholder="Room ID (optional)"/><button>Join</button>
        </form>
    );
  }
}

ReactDOM.render(<NewGame/>, document.getElementById('newGame'));
