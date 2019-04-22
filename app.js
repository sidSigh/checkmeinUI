const express = require('express');

var app = express();

var port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
// const say = require('say')
const path = require('path');
const { Pool, Client } = require('pg')
const connectionString = "postgressql://siddharthsingh:@localhost:5432/checkmein"
const client = new Client({
    connectionString: connectionString
});
client.connect()

client.query('SELECT * FROM users', (err, res) => {
    console.log(res.rows);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );



app.use(express.static(path.join(__dirname, 'public')));


console.log(`app running on port ${port}`);


app.post("/login", (req, res) => {
   var email=req.body.email;
   var password=req.body.password;
    client.query("SELECT * FROM users WHERE email='" + email + "' AND password='"+password+"'", (err, result) => {
       console.log(result.rows);
        res.send(result.rows);

    });

});
app.post("/signup", (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.username);
    // var query ='INSERT INTO users (name,email,password) VALUES ($1, $2, $3)',[] + req.body.username + ',' + req.body.email + ',' + req.body.password + ' )';
    // console.log(query);
    client.query('INSERT INTO users (name,email,password,joined) VALUES ($1, $2, $3, $4)',[req.body.username,req.body.email,req.body.password,new Date()],(err,res)=>{
        if(err){
            console.log(err.detail);
        }
    });
  
});
app.post("/upload", (req, res) => {
    console.log(req.body.name);
    console.log(req.body.details);
    console.log(req.body.url)
    // var query ='INSERT INTO users (name,email,password) VALUES ($1, $2, $3)',[] + req.body.username + ',' + req.body.email + ',' + req.body.password + ' )';
    // console.log(query);
    client.query('INSERT INTO events (name,location,details,joined,image) VALUES ($1, $2, $3, $4, $5)',
    [req.body.name,req.body.location,req.body.details,new Date(),req.body.url],(err,res)=>{
        if(err){
            console.log(err.detail);
        }
    });
  
});

app.get('/events',(req,res)=>{
    client.query('SELECT * FROM events', (err, result) => {
        res.send(result.rows);
    });

});
// app.get('/edit',(req,res)=>{
//     client.query('SELECT * FROM users', (err, result) => {
//         res.send(result.rows);
//     });

// });
app.post("/update", (req, res) => {
    
    // var query ='INSERT INTO users (name,email,password) VALUES ($1, $2, $3)',[] + req.body.username + ',' + req.body.email + ',' + req.body.password + ' )';
    // console.log(query);
    console.log('idhar-----------------------') ;
    client.query("UPDATE users SET email=$2, name=$1 WHERE id='26'",
    [req.body.username, req.body.email],(err,res)=>{
        if(err){
            console.log("err------------")
            console.log(err.detail);

        }
       
    console.log('Sidyaha_______________________')
    console.log(req.body.email);
    console.log(req.body.username);

    });
  
  
});
app.post('/single',(req,res)=>{
    console.log('hit-------------') ;
    console.log(req) ;
     client.query("SELECT * FROM events WHERE id='" + req.body.pid + "'", (err, result) => {
        res.send(result.rows);
    });

 });
app.post('/checkin',(req,res)=>{
    // var id =req.body.id;
    client.query('INSERT INTO checkin (postid,postname,postdetails,postimage,username) VALUES ($1, $2, $3, $4, $5)',
    [req.body.id,req.body.name,req.body.details,req.body.image,'sid@gmail.com'],(err,res)=>{
        if(err){
            console.log(err.detail);
        }
    });

});
app.get('/checkinevents',(req,res)=>{
    client.query('SELECT * FROM checkin', (err, result) => {
        res.send(result.rows);
    });

});

app.post('/removeevent',(req,res)=>{
    var id = req.body.id;
    client.query('DELETE FROM checkin WHERE postid=($1)',[id],(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        res.send(result);
    })

});

    app.listen(port);