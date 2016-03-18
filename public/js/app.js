// var mongoose = require('mongoose');
// require('../app/models/model.js');
// mongoose.connect("mongodb://localhost/LeagueStatTrackerApp");
// Create the LeagueStatTrackerApp module.
// ngRoute handles routing, allows for this to be single page app.
// ngAnimate allows adding transitions and animations.
var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp', ['ngRoute', 'ngAnimate', 'ngDialog', 'angularCharts']);


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

// CONTROLLERS
LeagueStatTrackerApp.controller('mainController', ['$scope', '$champions', '$location', function($scope, $champions, $location) {

  $scope.pageClass = "page-home";
  $scope.apiKey = "YOUR_KEY";

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

  $scope.go = function(path) {
    $location.path(path);
  }


  $scope.freeChamps = $champions.getFree($scope.apiKey, function() {
    $scope.getChampImages();
  });

  $scope.getChampImages = function() {
    var images = [];
    for (var i = 0; i < $scope.freeChamps.value.length; i ++) {

      $scope.img = $champions.getChampImages($scope.apiKey, $scope.freeChamps.value[i].id);
      images.push($scope.img);
    }
    $scope.freeChamps.images = images;
  };

}]);


//Summoners controller.  Used for looking up summoner stats.
LeagueStatTrackerApp.controller('summonerController', ['$scope', '$summoner', function($scope, $summoner, ngDialog) {

  $scope.pageClass = "page-summoner";
  $scope.apiKey = "YOUR_KEY";

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
  $scope.summoner;
  $scope.iconUrl = "http://ddragon.leagueoflegends.com/cdn/6.5.1/img/profileicon/0.png"


  $scope.summonerSearch = function(isValid) {
    if (isValid) {
        // Should connect to back end to do the search.
      $scope.summoner = $summoner.get($scope.searchName, $scope.regions.selectedOption.name, $scope.apiKey, function() {
        $scope.getStats();
        $scope.getRecent();
        $scope.getRank();
        $scope.getRunes();
        $scope.getMasteries();
        $scope.iconUrl = "http://ddragon.leagueoflegends.com/cdn/6.5.1/img/profileicon/" + $scope.summoner.value.profileIconId + ".png"
      });
    }
  };

  $scope.getStats = function(callback) {
    $scope.summoner.stats = $summoner.getStats($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey, function(){
      $scope.getData("wins");      
    });
  };
  
  $scope.getRank = function() {
    $scope.summoner.rank = $summoner.getRank(
      $scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey);
  };

  $scope.getRecent = function(callback) {
    $scope.summoner.recent = $summoner.getRecent($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey, function(){
      $scope.getChamp();
    });
  };

  $scope.getChamp = function() {
    for (var i = 0; i < $scope.summoner.recent.length; i++) {

      // Get the two teams and add to the recent.
      var teams = {
        teamOne: [],
        teamTwo: []
      }
      
      // Get the id and champion of other summoners in the game.
      $scope.summoner.recent[i].fellowPlayers.forEach(function(player) {
        $scope.summoner.champ = $summoner.getChamp(player.championId, $scope.regions.selectedOption.name, $scope.apiKey)
        if (player.teamId == 100) {
          teams.teamOne.push(
            {
              "id": player.summonerId,
              "champ": $scope.summoner.champ
            }
          )
        } else if (player.teamId == 200) {
          teams.teamTwo.push(
            {
              "id": player.summonerId,
              "champ": $scope.summoner.champ
            }
          )
        }
      })

      // Get the summoner's id and champion onto the right team.
      if ($scope.summoner.recent[i].teamId == 100) {
        $scope.summoner.recent[i].champ = $summoner.getChamp($scope.summoner.recent[i].championId, $scope.regions.selectedOption.name, $scope.apiKey)
        teams.teamOne.push(
          {
            "id": $scope.summoner.value.id,
            "champ": $scope.summoner.recent[i].champ
          }
        )
      }  else {
        $scope.summoner.recent[i].champ = $summoner.getChamp($scope.summoner.recent[i].championId, $scope.regions.selectedOption.name, $scope.apiKey)
        teams.teamTwo.push(
          {
            "id": $scope.summoner.value.id, 
            "champ": $scope.summoner.recent[i].champ
          }
        )
      } 

      $scope.summoner.recent[i].teams = teams;
    }
  }

  $scope.getRunes = function() {
    $scope.summoner.runes = $summoner.getRunes($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey);
  };

  $scope.getMasteries = function() {
    $scope.summoner.masteries = $summoner.getMasteries($scope.summoner.value.id, $scope.regions.selectedOption.name, $scope.apiKey);
  };

  $scope.getData = function(type) {
    if ($scope.searchName == '') {
      return false;
    }
    $scope.config = {
      title: type,
      tooltips: true,
      labels: true,
      // mouseover: function() {},
      // mouseout: function() {},
      // click: function() {},
      // legend: {
      //   display: true,
      //   position: 'left' //or right
      // },
      // colors: [],
      isAnimate: true
    };

    var series = [];
    var data =  [];
    // This should be put into database.
    var gametypes = [
      {
        type: "CAP5x5",
        name: "Team Builder",
        code: "TB"
      },
      {
        type: "CoopVsAI",
        name: "Coop 5 v 5",
        code: "COOP5"
      }, 
      {
        type: "CoopVsAI3x3",
        name: "Coop 3 v 3",
        code: "COOP3"
      },
      {
        type: "OdinUnranked",
        name: "Dominion",
        code: "DOM"
      },
      {
        type: "RankedTeam3x3",
        name: "Ranked 3 v 3",
        code: "R3"
      },
      {
        type: "RankedTeam5x5",
        name: "Ranked Team",
        code: "RTeam"
      },
      {
        type: "Unranked3x3",
        name: "Twisted Treeline",
        code: "TT"
      },
      {
        type: "RankedSolo5x5",
        name: "Ranked Solo",
        code: "R1"
      },
      {
        type: "AramUnranked5x5",
        name: "All Random All Mid",
        code: "ARAM"
      },
      {
        type: "Unranked",
        name: "Normal",
        code: "NORM"
      },
      {
        type: "RankedPremade5x5",
        name: "Ranked 5 v 5",
        code: "R5"
      }
    ];

    var stats = $scope.summoner.stats;
    var gameIndex;
    for (var i = 0; i < stats.length; i++) {

      for (var j = 0; j < gametypes.length ; j++) {
        if (stats[i].playerStatSummaryType == gametypes[j].type) {
          gameIndex = j;
          break;
        }
      }
      series.push(gametypes[gameIndex].name)

      var yData;
      switch(type) {
        case 'wins':
          if (stats[i].hasOwnProperty('wins')) {
            yData = stats[i].wins; 
          } else {
            yData = 0;
          }

          break;
        case 'totalchampionkills':
          if (stats[i].aggregatedStats.hasOwnProperty('totalChampionKills')) { 
            yData = stats[i].aggregatedStats.totalChampionKills;
          } else {
            yData = 0;
          }
          break;
        case 'totalneutralminionskilled':
          if (stats[i].aggregatedStats.hasOwnProperty('totalNeutralMinionsKilled')) { 
            yData = stats[i].aggregatedStats.totalNeutralMinionsKilled;
          } else {
            yData = 0;
          }
          break;
        case 'totalminionkills':
          if (stats[i].aggregatedStats.hasOwnProperty('totalMinionKills')) { 
            yData = stats[i].aggregatedStats.totalMinionKills;
          } else {
            yData = 0;
          }
          break;
        case 'totalassists':
          if (stats[i].aggregatedStats.hasOwnProperty('totalAssists')) { 
            yData = stats[i].aggregatedStats.totalAssists;
          } else {
            yData = 0;
          }
          break;
        case 'totalturretskilled':
          if (stats[i].aggregatedStats.hasOwnProperty('totalTurretsKilled')) { 
            yData = stats[i].aggregatedStats.totalTurretsKilled;
          } else {
            yData = 0;
          }
          break;
        default:
          yData = 0;
      }

      var dataset = {
        x: gametypes[gameIndex].code,
        y: [yData],
        tooltip: gametypes[gameIndex].name
      };
      data.push(dataset);
    }


    $scope.data = {
      series: series,
      data: data
    };
  }
}]);



