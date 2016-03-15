var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp', ['ngRoute', 'ngAnimate']);

LeagueStatTrackerApp.factory('$summoner', ['$http', function($http) {
  "use strict";
  return {
    get: function(summonerName, region) {
      var path = "https://na.api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/"+ summonerName + "?api_key=" + "8a959856-61b1-4248-8746-ee2e0c36f64f";
      

      return $http.get(path).then(function(res) {
        angular.fromJson(res.data);
      });
    }
  }
}]);