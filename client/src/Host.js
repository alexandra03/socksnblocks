import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './Host.css';

const config = require('./config.json');

class Host extends Component {
    constructor() {
        super();

        this.state = {
            players: 0
        };
        
        this.socket = socketIOClient(config.socketIOClient);

        this.socket.on('players updated', (info) => {
            if (info.host_id === this.props.code) {
                this.setState({
                    players: info.players
                });
            }
        });
    }

    render() {
        return (
            <div>
                <h2>You are hosting!</h2>
                <h3>Your host code is {this.props.code}</h3>
                <div>
                    <h4>There are currently {this.state.players} players</h4>
                </div>
            </div>
        );
    }
}



export default Host;
