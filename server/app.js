var express = require('express');
var Sequelize = require('sequelize');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var db = require('../models').db;
var models = require('../models');
var Hotel = models.Hotel;
var Activity = models.Activity;
var Restaurant = models.Restaurant;
var Place = models.Place;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(function(err, req, res, next){
  res.status(err.status || 500).send(err.message);
});

app.get('/', function(req, res, next){
  res.render('index', function(err, html){
    res.send(html);
  })
  .next()
})

app.get('/api', function(req, res, next){
  var hotel = Hotel.findAll({ include: [ {all: true} ]});
  var restaurant = Restaurant.findAll({ include: [ {all: true} ]});
  var activity = Activity.findAll({ include: [ {all: true} ]});

  Promise.all([hotel, restaurant, activity])
    .then(function(value){
      res.json(value)
    })
    .catch(next)
});

var port = 3000;
app.listen(port, function(){
  console.log("The server is listening closely on port", port);
  db
    .sync()
    .then(function() {
      console.log("Synchronated the database");
    })
    .catch(function(err) {
      console.error("Trouble right here in River City", err, err.stack);
    });
})

module.exports = app;
