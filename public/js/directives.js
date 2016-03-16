var LeagueStatTrackerApp = angular.module('LeagueStatTrackerApp');

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
    template: '<div role="tabpanel" class="tab" ng-show="active" ng-transclude></div>',
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


// The summoner info tab panel data to be displayed.
LeagueStatTrackerApp.directive('summonerinfo', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'views/summoner-info.html'
  }
});