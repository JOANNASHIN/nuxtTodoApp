const express = require("express");
const app = express(); //express인스턴스 생성
const mysql = require('mysql');

// Connection 객체 생성 
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',   
  password: '7985Wldms*',
  database: 'movies'  
});  

// Connect
connection.connect(function (err) {   
  if (err) {     
    console.error('mysql connection error');     
    console.error(err);     
    throw err;   
  } 
});

app.get('/', function (req, res) {
    connection.query('SELECT * FROM users', function (err, rows) {
      if (err) throw err;
      res.send(rows);
    });
});

module.exports = {
    path: "/api",
    handler: app
}