// Create the LeagueStatTrackerApp module.
// ngRoute handles routing, allows for this to be single page app.
// ngAnimate allows adding transitions and animations.
var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp', ['ngRoute', 'ngAnimate', ]);

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
});

// DIRECTIVES
// Represents a navbar widget.
LeagueStatTrackerApp.directive('navbar', function() {
  return {
    // Restricted to being an element.
    restrict: 'E',
    // Directive will insert any content included between <navbar></navbar>.
    transclude: true,
    scope: { },
    templateUrl: 'views/navbar.html'
  }
});

// Represents a single pane in the tabs widget.
LeagueStatTrackerApp.directive('tab', function() {
  return {
    restrict: 'E',
    transclude: true,
    // Specify HTML template string to be insterted into the DOM when the element directive is used.
    // ng-show will automatically show active tabs.
    template: '<div role="tabpanel" ng-show="active" ng-transclude></div>',
    // '^' instructs directive to move up the scope heirarchy one level and look for the controller on tabset.
    require: '^tabset',
    // Tells directive what scope to use with properties that will be bound to the directive's isolated scope and be available for use inside the directive.
    scope: {
      // '@' symbol means scope property must be a string.
      heading: '@'
    },
    // Specify linking function.
    link: function(scope, elem, attr, tabsetCtrl) {
      // Sets all tabs as inactive when they begin.
      scope.active = false;
      tabsetCtrl.addTab(scope);
    }
  }
});

// Used to wrap multiple tabs and provide the logic needed to select which tab is shown.
LeagueStatTrackerApp.directive('tabset', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: { },
    templateUrl: './views/tabset.html',
    bindToController: true,
    controllerAs: 'tabset',
    controller: function() {
      var self = this;
      self.tabs = [];
      self.addTab = function addTab(tab) {
        self.tabs.push(tab);
        if (self.tabs.length === 1) {
          tab.active = true;
        }
      }
      self.select = function(selectedTab) {
        angular.forEach(self.tabs, function(tab) {
          if (tab.active && tab != selectedTab) {
            tab.active = false;
          }
        })
        selectedTab.active = true;
      }
    }
  }
});


// CONTROLLERS
// Create the controllers and inject Angular's scope.
// -----------
LeagueStatTrackerApp.controller('mainController', function($scope) {
});

//Summoners controller.  Used for looking up summoner stats.
LeagueStatTrackerApp.controller('summonerController', ['$scope', '$summoner', function($scope, $summoner) {
  $scope.pageClass = "page-summoner";

  $scope.apiKey = 'YOUR_API_KEY';

  $scope.regions = {
    repeatSelect: null,
    availableOptions: [
      {id: '1', name: 'br'},
      {id: '2', name: 'eune'},
      {id: '3', name: 'euw'},
      {id: '4', name: 'kr'},
      {id: '5', name: 'lan'},
      {id: '6', name: 'las'},
      {id: '7', name: 'na'},
      {id: '8', name: 'oce'},
      {id: '9', name: 'ru'},
      {id: '10', name: 'tr'}
    ],
    selectedOption: {id: '7', name: 'na'}
  };

  $scope.searchName = '';
  $scope.iconUrl = "http://ddragon.leagueoflegends.com/cdn/6.5.1/img/profileicon/0.png"
  $scope.summonerSearch = function() {
    // Should connect to back and to do the search.
    $scope.summoner = $summoner.get($scope.searchName, $scope.regions.selectedOption.name, $scope.apiKey, function() {
      $scope.getStats();
      $scope.getRecent();
      $scope.getRunes();
      $scope.getMasteries();

      $scope.iconUrl = "http://ddragon.leagueoflegends.com/cdn/6.5.1/img/profileicon/" + $scope.summoner.value.profileIconId + ".png"
    });
  };

  $scope.getStats = function() {
    $scope.summoner.stats = $summoner.getStats($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey);
  };

  $scope.getRecent = function() {
    $scope.summoner.recent = $summoner.getRecent($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey);
  };

  $scope.getRunes = function() {
    $scope.summoner.runes = $summoner.getRunes($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey);
  };

  $scope.getMasteries = function() {
    $scope.summoner.masteries = $summoner.getMasteries($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey);
  };
}]);





// FACTORIES
// ---------
// Should be able to refactor into a separate .js file.
LeagueStatTrackerApp.factory('$summoner', ['$http', '$q', function($http, $q) {
  "use strict";
  return {
    get: function(summonerName, region, key, callback) {
      var deferred = $q.defer();
      var summoner = {};
      var path = "https://na.api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/"+ summonerName + "?api_key=" + key;

      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var key;
        for (key in res) {
          if (res.hasOwnProperty(key)) {
            deferred.resolve((summoner[key] = res[key]));
          }
        }
        if (callback) {
          callback();
        }
      });

      return deferred.promise.$$state;
    },

    getStats: function(summonerID, region, key) {
      var stats = [];

      var path = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + summonerID +"/summary?api_key=" + key;

      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var responses = res.playerStatSummaries
        for (var i=0; i < responses.length; i++) {
          stats[i] = responses[i];
        }
      });
      return stats;
    },

    getRecent: function(summonerID, region, key) {
      var recent = [];
      var path = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/game/by-summoner/" + summonerID +"/recent?api_key=" + key;

      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var responses = res.games
        for (var i=0; i < responses.length; i++) {
          recent[i] = responses[i];
        }
      });
      return recent;
    },

    getRunes: function(summonerID, region, key) {
      var runes = [];
      var path = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/" + summonerID + "/runes?api_key=" + key;
      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var responses = res[summonerID].pages
        for (var i=0; i < responses.length; i++) {
          runes[i] = responses[i];
        }
      });
      return runes;
    },

    getMasteries: function(summonerID, region, key) {
      var masteries = [];
      var path = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/" + summonerID + "/masteries?api_key=" + key;
      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var responses = res[summonerID].pages
        for (var i=0; i < responses.length; i++) {
          masteries[i] = responses[i];
        }
      });
      return masteries;
    }
  }
}]);



