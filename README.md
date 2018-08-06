# Socks & Blocks

To set up, make sure you have a recent version of npm (I'm using 5.6.0) and then:

```bash
$ git clone https://github.com/alexandra03/socksnblocks.git
```

Create a new [Firebase project (with Cloud Firestore)](https://console.firebase.google.com) and update `socksnblocks/server/config.json` with the API info.

To run the server:
```bash
$ cd socksnblocks/server
$ npm install
$ node.js server.js
```

To run the client:
```bash
$ cd socksnblocks/client
$ npm install
$ npm start
```

Once both client and server are running, go to `http://localhost:3000`
