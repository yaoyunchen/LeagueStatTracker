var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp');

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
            deferred.resolve(summoner[key] = res[key]);
          }
        }
        if (callback) {
          callback();
        }
      });

      return deferred.promise.$$state;
    },

    getStats: function(summonerID, region, key, callback) {
      //var deferred = $q.defer();
      var stats = [];

      var path = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + summonerID +"/summary?api_key=" + key;

      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var responses = res.playerStatSummaries
        for (var i=0; i < responses.length; i++) {
          //deferred.resolve(stats[i] = responses[i]);
          stats[i] = responses[i]
        }
        if (callback) {
          callback();
        }
      });
      return stats;
    },

    getRank: function(summonerID, region, key) {
      var rank = [];
      var path = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.5/league/by-summoner/" + summonerID + "/entry?api_key=" + key;
      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var key;
        for (key in res) {
          if (res.hasOwnProperty(key)) {
            rank[key] = res[key][0];
          }
        }
      });
      return rank;
    },

    getRecent: function(summonerID, region, key, callback) {
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
        if (callback) {
          callback();
        }
      });
      return recent;
    },

    
    getChamp: function(champId, region, key) {
      var deferred = $q.defer();
      var champ = [];
      // Gets the image URL of the champion. API call to League's static database, does not count towards call limit.  
      var imgPath = "https://global.api.pvp.net/api/lol/static-data/" + region + "/v1.2/champion/" + champId + "?champData=image&api_key=" + key;
      
      $http.get(imgPath)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        deferred.resolve(champ = res);
      });
      
      return deferred.promise.$$state;
    },

    getRunes: function(summonerID, region, key) {
      var runes = [];
      var path = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/" + summonerID + "/runes?api_key=" + key;
      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        var responses = res[summonerID].pages;
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


LeagueStatTrackerApp.factory('$champions', ['$http', '$q', function($http, $q) {
  "use strict";
  return {
    getFree: function(key, callback) {
      var deferred = $q.defer();
      var champs = [];
      var path = "https://na.api.pvp.net/api/lol/na/v1.2/champion?freeToPlay=true&api_key=" + key;
      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        deferred.resolve(champs = res.champions);
        if (callback) {
            callback();
        }
      });

      return deferred.promise.$$state;
    },

    getChampImages: function(key, id) {
      var deferred = $q.defer();
      var imageID = [];
      var path = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + id + "?champData=image&api_key=" + key;
      $http.get(path)
      .then(function(res) {
        return angular.fromJson(res.data);
      })
      .then(function(res) {
        deferred.resolve(imageID = res.key);
      });

      return deferred.promise.$$state;
    }
  }
}]);