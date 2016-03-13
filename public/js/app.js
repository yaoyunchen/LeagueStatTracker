// Create the LeagueStatTrackerApp module.
// ngRoute handles routing, allows for this to be single page app.
var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp', ['ngRoute']);

// Configure routes.
LeagueStatTrackerApp.config(function($routeProvider){
  $routeProvider
    // Homepage.
    .when('/', {
      templateUrl : 'views/home.html',
      controller  : 'mainController'
    })
    // Summoners.
    .when('/summoners', {
      templateUrl : 'views/summoners.html',
      controller  : 'summonerController'
    })
})

//Create the controller and inject Angular's scope.
.controller('mainController', function($scope) {
  $scope.message = 'LeagueStatTrackerApp module now displaying.'
})

// Represents a navbar widget.
.directive('navbar', function() {
  return {
    // Restricted to being an element.
    restrict: 'E',
    // Directive will insert any content included between <navbar></navbar>.
    transclude: true,
    scope: { },
    templateUrl: 'views/navbar.html'
  }
});
