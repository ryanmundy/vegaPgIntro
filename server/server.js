// requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
//pg required for SQL
const pg = require('pg');
//uses
app.use( express.static( 'server/public/' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
//globals
const port = process.env.PORT || 5000;
//create pool for SQL connections
const Pool = pg.Pool;//class
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
}); //end pool

//when connect to DB
pool.on('connect', ()=>{
    console.log('connected to DB');   
})//end connect

pool.on('error', (err) =>{
    console.log('error with DB:', err);
})//end error

// spin up server
app.listen( port, ( req, res )=>{
    console.log( 'server up on:', port );
});

//test route
app.get('/songs', (req, res)=>{
    console.log('/test GET hit');
    //create a query
    const queryString = 'SELECT * FROM songs;';
    //run query on the pool
    pool.query(queryString).then((results)=>{
    //send results back to client
        res.send(results.rows);
    }).catch((err)=>{
    //handle any errors
    console.log('error retrieving data:', err);
    })//end query
    //res.send('growl');
});//end test route

app.post('/songs', (req, res)=>{
    console.log('in /songs POST:', req.body);
    //res.send('chirp');
    //create query string
    const queryString = 'INSERT INTO songs (artist, track, rank, published) VALUES ($1, $2, $3, $4);';
    pool.query(queryString, [ req.body.artist, req.body.track, req.body.rank, req.body.published ]).then(()=>{
        res.sendStatus(201);
    }).catch((err)=>{
        console.log('error writing song:', err);
        res.sendStatus(500);
        
    });//end query
    
})//end /songs POST