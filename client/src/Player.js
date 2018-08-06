import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './Player.css';

const config = require('./config.json');

class Player extends Component {
    constructor() {
        super();

        this.state = {
            code: '',
            host_joined: false
        };
        
        this.socket = socketIOClient(config.socketIOClient);

        this.socket.on('host joined', (host_joined) => {
            this.setHostJoined(host_joined);
        });
        
        this.socket.on('host disconnected', (code) => {
            if (this.state.code === code) {
                this.setState({
                    code: '',
                    host_joined: false,
                });
            }
        });

    }

    setHostJoined = (host_joined) => {
        this.setState({host_joined});
    }

    codeEntered = (event) => {
        let code = event.target.value;
        this.setState({code});
    }    

    codeFormSubmitted = (event) => {
        event.preventDefault();
        this.socket.emit('host code entered', this.state.code);
    }

    CodeStatus = (props) => {
        if (!this.state.host_joined) {
            return (
                <div>
                    <h3>Enter the host code here:</h3>
                    <form onSubmit={this.codeFormSubmitted}>
                        <input type="text" name="code" onChange={this.codeEntered}/>
                        <button type="submit">Join</button>
                    </form>
                </div>
            );
        } else {
            return (
                <div>
                    <h3>You are in host {this.state.code}</h3>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <h2>You are a player!</h2>
                <this.CodeStatus />
            </div>
        );
    }
}



export default Player;
