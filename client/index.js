const mapboxgl = require("mapbox-gl");
const buildMarker = require("./marker.js");

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JpbWFtYSIsImEiOiJjamE5dDlkOHowYjJ0MzNxdHNoZ3c1b3VpIn0.cWRIdciYlzzPtnmajtS3nA';

//const fullstackCoords = [-74.009, 40.705] // NY
const fullstackCoords = [-87.6320523, 41.8881084] // CHI

const map = new mapboxgl.Map({
  container: "map",
  center: fullstackCoords, // FullStack coordinates
  zoom: 12, // starting zoom
  style: "mapbox://styles/mapbox/streets-v10" // mapbox has lots of different map styles available.
});

const marker = buildMarker("activities", fullstackCoords);
marker.addTo(map);

var documentHotelSelects = document.getElementById('hotels-choices');
var documentRestaurantSelects = document.getElementById('restaurants-choices');
var documentActivitySelects = document.getElementById('activities-choices');

document.addEventListener('DOMContentLoaded', function(event) {
  fetch('/api')
    .then(function(result){
      return result.json();
    })
    .then(function(data){
      for (var i = 0; i < data[0].length; i++){
        documentHotelSelects.innerHTML += `<option>${data[0][i].name}</option>`
      }
      for (var x = 0; x < data[1].length; x++){
        documentRestaurantSelects.innerHTML += `<option>${data[1][x].name}</option>`
      }
      for (var y = 0; y < data[2].length; y++){
        documentActivitySelects.innerHTML += `<option>${data[2][y].name}</option>`
      }


      document.body.addEventListener('click', function(event){
        if (event.target.matches('#hotels-add')){
          var selectedHotel = documentHotelSelects.options[documentHotelSelects.selectedIndex].text
         documentHotelList.innerHTML += `<li data-name="${selectedHotel}">${selectedHotel}<button class='remove-button-hotel'>x</button></li>`
         data[0].filter(function(eachHotel){
           if (eachHotel.name === selectedHotel){
            buildMarker('hotels', eachHotel.place.location, eachHotel.name).addTo(map)
           }
         })
        }
        if (event.target.matches('#restaurants-add')){
         var selectedRestaurant = documentRestaurantSelects.options[documentRestaurantSelects.selectedIndex].text
        documentRestaurantList.innerHTML += `<li>${selectedRestaurant}<button class='remove-button-restaurant'>x</button></li>`
        data[1].filter(function(eachRestaurant){
          if (eachRestaurant.name === selectedRestaurant){
           buildMarker('restaurants', eachRestaurant.place.location).addTo(map)
          }
        })
       }
       if (event.target.matches('#activities-add')){
         var selectedActivity = documentActivitySelects.options[documentActivitySelects.selectedIndex].text
        documentActivityList.innerHTML += `<li>${selectedActivity}<button class='remove-button-activity'>x</button></li>`
        data[2].filter(function(eachActivity){
          if (eachActivity.name === selectedActivity){
           buildMarker('activities', eachActivity.place.location).addTo(map)
          }
        })
       }
      })

      document.body.addEventListener('click', function(event){
        if (event.target.matches('.remove-button-hotel')){
          console.log(event.target.parentNode.dataset.name)
          event.target.parentNode.remove();

        }
      })

    })
    .catch(console.error)
 });

 var documentHotelList = document.getElementById('hotels-list');
 var documentRestaurantList = document.getElementById('restaurants-list');
 var documentActivityList = document.getElementById('activities-list');


