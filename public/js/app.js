// Create the LeagueStatTrackerApp module.
// ngRoute handles routing, allows for this to be single page app.
// ngAnimate allows adding transitions and animations.
var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp', ['ngRoute', 'ngAnimate']);

// Configure routes.
LeagueStatTrackerApp.config(function($routeProvider){
  $routeProvider
    // Homepage.
    .when('/', {
      templateUrl : 'views/home.html',
      controller  : 'mainController'
    })
    // Summoner.
    .when('/summoner', {
      templateUrl : 'views/summoner.html',
      controller  : 'summonerController'
    })
})

// CONTROLLERS
// Create the controllers and inject Angular's scope.
// -----------
.controller('mainController', function($scope) {
  $scope.message = 'LeagueStatTrackerApp module now displaying.'
})

//Summoners controller.  Used for looking up summoner stats.
.controller('summonerController', function($scope) {
  $scope.pageClass = "page-summoner"

  $scope.region = '';
  $scope.apikey = '';


  $scope.message = "Summoner page module now displaying."
  $scope.name = "Summoner"
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
