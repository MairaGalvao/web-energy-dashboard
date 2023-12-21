const { Client } = require('pg');


const client = new Client(
    { user: 'mairagalvao',
     host: 'localhost',
      database: 'mairagalvao',
       password: 'peotanju',
        port: 5555,})


        client.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
          });