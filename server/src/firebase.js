const firebase = require('firebase');

const config = require('../config.json').firebase;

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

module.exports = firebase;
