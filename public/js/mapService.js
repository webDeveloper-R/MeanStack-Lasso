'use strict';
angular.module('lassoo')
.service('lazyLoadApi', function lazyLoadApi($window, $q) {
  function loadScript() {
    console.log('loadScript')
      // use global document since Angular's $document is weak
    var s = document.createElement('script')
    s.src = '//maps.googleapis.com/maps/api/js?sensor=false&language=en&callback=initMap'
    document.body.appendChild(s)
  }
  var deferred = $q.defer()

  $window.initMap = function() {
    deferred.resolve()
  }

  if ($window.attachEvent) {
    $window.attachEvent('onload', loadScript)
  } else {
    $window.addEventListener('load', loadScript, false)
  }
  return deferred.promise
});