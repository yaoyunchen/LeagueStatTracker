var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp');

// The homepage widget.
LeagueStatTrackerApp.directive('homepage', function() {
  return {
    // Restricted to being an element.
    restrict: 'E',
    // Directive will insert any content included between <navbar></navbar>.
    transclude: true,
    // Tells directive what scope to use with properties that will be bound to the directive's isolated scope and be available for use inside the directive.
    scope: { },
    // URL to the html template of the view to be injected.
    templateUrl: 'views/home.html'
  }
});

// Represents a navbar widget.
LeagueStatTrackerApp.directive('navbar', function() {
  return {
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
    template: '<div role="tabpanel" class="tab" ng-show="active" ng-transclude></div>',
    // '^' instructs directive to move up the scope heirarchy one level and look for the controller on tabset.
    require: '^tabset',
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
      // Creates an array of tabs, and sets the tab to be active.
      self.addTab = function addTab(tab) {
        self.tabs.push(tab);
        if (self.tabs.length === 1) {
          tab.active = true;
        }
      }
      // Deselects (removes active) tabs that were selected before, and sets the newly selected tab to be the active tab.
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


// The summoner info tab panel data to be displayed.
LeagueStatTrackerApp.directive('summonerinfo', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'views/summoner-info.html'
  }
});

// The summoner's recent matches tab panel data to be displayed.
LeagueStatTrackerApp.directive('summonerrecent', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'views/summoner-recent.html'
  }
});


// The summoner's runes tab panel data to be displayed.
LeagueStatTrackerApp.directive('summonerrunes', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'views/summoner-runes.html'
  }
});

// The summoner's masteries tab panel data to be displayed.
LeagueStatTrackerApp.directive('summonermasteries', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'views/summoner-masteries.html'
  }
});


LeagueStatTrackerApp.directive("ngbgslideshow", function($interval) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'views/slideshow.html',
        link: function( scope, elem, attrs ) {
          scope.active_image = 0;
          scope.interval = 5000;

          scope.$watch( 'freeChamps', function() {
            if (scope.freeChamps.images != undefined) {
              var urls = [];
              var names = [];
              scope.freeChamps.images.forEach(function(ele) {
                if (ele.value != undefined) {
                  var url = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + ele.value + "_0.jpg";
                  var name = ele.value
                }
                if (url) {
                  urls.push(url);
                }
                if (name) {
                  names.push(name);
                }
              })
              if (urls.length == 10) {
                 scope.images = urls;
              }
              if (names.length == 10) {
                scope.names = names;
                scope.champName = names[scope.active_image];
              }
            }
          }, true);

          var change = $interval(function() {
            scope.active_image++;
            scope.champName = scope.names[scope.active_image]
            if( scope.active_image >= scope.images.length )
              scope.active_image = 0;
              scope.champName = scope.names[scope.active_image]
          }, scope.interval || 1000 );
      
          scope.$on('$destroy', function() {
            $interval.cancel( change );
          });
        }
    };  
});         

