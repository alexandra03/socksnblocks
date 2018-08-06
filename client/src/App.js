import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

import Host from './Host.js';
import Player from './Player.js';

const config = require('./config.json');

class App extends Component {
    constructor() {
        super();

        this.state = {
            role: null,
            code: null,
        };
        
        this.socket = socketIOClient(config.socketIOClient);

        this.socket.on('host code', (code) => {
            this.setCode(code);
        });
    }

    setRole = (role) => {
        this.setState({ role });
	    this.socket.emit('role chosen', role);        
    }

    setCode = (code) => {
        this.setState({ code });        
    }    

    UserTypeSelection = (props) => {
        return (
            <div>
                <button id="host" onClick={() => this.setRole('host')}>Host a game</button>
                <button id="player" onClick={() => this.setRole('player')}>Join a game</button>
            </div>
        );
    }

    render() {
        if (this.state.role === null) {
            return <this.UserTypeSelection />
        } else if (this.state.role === 'host' && this.state.code !== null) {
            return <Host code={this.state.code}/>
        } else if (this.state.role === 'player' && this.state.code === null) {
            return <Player/>
        } else {
            return <div>Processing...</div>
        }
    }
}

export default App;
