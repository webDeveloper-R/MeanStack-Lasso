'use strict';
angular.module('lassoo')
.controller('HomeCtrl', ['$scope', '$state', 'auth', 'lazyLoadApi', function($scope, $state, auth, lazyLoadApi){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
    if(!auth.isLoggedIn()){        
        return $state.go('login');
    }
    var location = null,
        map = null,
        mapOptions = null,
        locationLat = null,
        locationLng = null,
        directionsDisplay = [],
        waypoints = [],
        routeColor = [];

    $.getJSON('http://api.wipmania.com/jsonp?callback=?', function (data) { 
      locationLat = data.latitude;
      locationLng = data.longitude;
    });
    // Loads google map script
    lazyLoadApi.then( initializeMap )
    // Initialize the map
    function initializeMap() {
        location = new google.maps.LatLng(51.513878, -0.111044);
        mapOptions = {
          zoom: 4,
          center: location
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        waypoints[0]= [{location: {lat: 51.515247, lng: -0.111560}},{location: {lat: 51.518249, lng: -0.113820}},{location: {lat: 51.513878, lng: -0.111044}},{location: {lat: 51.517636, lng: -0.120375}},{location: {lat: 51.513226, lng: -0.117310}},{location: {lat: 51.513103, lng: -0.114973}},{location: {lat: 51.513878, lng: -0.111044}}];
        waypoints[1]= [{location: '100 victoria embankment'}, {location: 'Blackfriars Bridge'}, {location: 'London SE1 9NY, UK'}];
        routeColor[0]= "blue";
        routeColor[1]= "red";
        displayRoute(map, routeColor[0], {lat: 51.513878, lng: -0.111044}, {lat: 51.513878, lng: -0.111044}, waypoints[0]);
        displayRoute(map, routeColor[1], 'London SE1 0NQ, UK', 'London SE1 0NQ, UK', waypoints[1]);
        var originMarker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
    function displayRoute(map, routeColor, origin, destination, waypoints) {
        var display = new google.maps.DirectionsRenderer({
              draggable: true,
              map: map,
              polylineOptions: {
                strokeColor: routeColor
              }
        });
        var service = new google.maps.DirectionsService();
        display.addListener('directions_changed', function() {
              computeTotalDistance(display.getDirections());
        });
        //var selectedMode = 'WALKING';
        var selectedMode = 'BICYCLING';
        service.route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode[selectedMode],
          avoidTolls: true
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            display.setDirections(response);
            display.setMap(map);
            display.setOptions( { suppressMarkers: true } );
          } else {
            alert('Could not display directions due to: ' + status);
          }
        });
    }
    function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        document.getElementById('total').innerHTML = total + ' km';
    }
}]);